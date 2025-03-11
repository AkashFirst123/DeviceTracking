import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertDeviceSchema, 
  insertLocationSchema, 
  insertAlertSchema,
  deviceTypes
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user with email or username already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already in use" });
      }
      
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      
      return res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: fromZodError(error).message 
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      
      // In a real application, you would generate a JWT token here
      // For this demo, we're just returning the user data
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/user", async (req: Request, res: Response) => {
    try {
      // In a real app, you would get the user ID from the JWT token
      // For this demo, let's assume we have a user ID in the query params
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Valid user ID is required" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Device routes
  app.post("/api/devices", async (req: Request, res: Response) => {
    try {
      const deviceData = insertDeviceSchema.parse(req.body);
      
      // Check if a device with this IMEI already exists
      const existingDevice = await storage.getDeviceByImei(deviceData.imei);
      if (existingDevice) {
        return res.status(400).json({ message: "A device with this IMEI is already registered" });
      }
      
      // Validate device type
      if (!deviceTypes.includes(deviceData.type as any)) {
        return res.status(400).json({ 
          message: "Invalid device type",
          validTypes: deviceTypes
        });
      }
      
      const device = await storage.createDevice(deviceData);
      
      return res.status(201).json(device);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: fromZodError(error).message 
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/devices", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Valid user ID is required" });
      }
      
      const devices = await storage.getDevicesByUser(userId);
      
      return res.status(200).json(devices);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/devices/:id", async (req: Request, res: Response) => {
    try {
      const deviceId = parseInt(req.params.id);
      
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Valid device ID is required" });
      }
      
      const device = await storage.getDevice(deviceId);
      
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      
      return res.status(200).json(device);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/devices/:id", async (req: Request, res: Response) => {
    try {
      const deviceId = parseInt(req.params.id);
      
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Valid device ID is required" });
      }
      
      // Validate update data with partial schema
      const updateData = req.body;
      
      const device = await storage.updateDevice(deviceId, updateData);
      
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      
      return res.status(200).json(device);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/devices/:id", async (req: Request, res: Response) => {
    try {
      const deviceId = parseInt(req.params.id);
      
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Valid device ID is required" });
      }
      
      const success = await storage.deleteDevice(deviceId);
      
      if (!success) {
        return res.status(404).json({ message: "Device not found" });
      }
      
      return res.status(204).end();
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/devices-with-locations", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Valid user ID is required" });
      }
      
      const devices = await storage.getDevicesWithLocations(userId);
      
      return res.status(200).json(devices);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/device-stats", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Valid user ID is required" });
      }
      
      const stats = await storage.getDeviceStats(userId);
      
      return res.status(200).json(stats);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Location routes
  app.post("/api/locations", async (req: Request, res: Response) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      
      // Verify that the device exists
      const device = await storage.getDevice(locationData.deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      
      const location = await storage.createLocation(locationData);
      
      return res.status(201).json(location);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: fromZodError(error).message 
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/locations/:deviceId", async (req: Request, res: Response) => {
    try {
      const deviceId = parseInt(req.params.deviceId);
      
      if (isNaN(deviceId)) {
        return res.status(400).json({ message: "Valid device ID is required" });
      }
      
      // Check if we're requesting the latest location only
      const latest = req.query.latest === 'true';
      
      if (latest) {
        const location = await storage.getLatestLocationByDevice(deviceId);
        
        if (!location) {
          return res.status(404).json({ message: "No locations found for this device" });
        }
        
        return res.status(200).json(location);
      }
      
      // Otherwise get history with optional limit
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const locations = await storage.getLocationHistory(deviceId, limit);
      
      return res.status(200).json(locations);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Alert routes
  app.post("/api/alerts", async (req: Request, res: Response) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      
      // Verify that the device exists
      const device = await storage.getDevice(alertData.deviceId);
      if (!device) {
        return res.status(404).json({ message: "Device not found" });
      }
      
      const alert = await storage.createAlert(alertData);
      
      return res.status(201).json(alert);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: fromZodError(error).message 
        });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/alerts", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Valid user ID is required" });
      }
      
      const alerts = await storage.getAlertsByUser(userId);
      
      return res.status(200).json(alerts);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/alerts/:id/read", async (req: Request, res: Response) => {
    try {
      const alertId = parseInt(req.params.id);
      
      if (isNaN(alertId)) {
        return res.status(400).json({ message: "Valid alert ID is required" });
      }
      
      const alert = await storage.markAlertAsRead(alertId);
      
      if (!alert) {
        return res.status(404).json({ message: "Alert not found" });
      }
      
      return res.status(200).json(alert);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
