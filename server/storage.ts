import { 
  users, type User, type InsertUser, 
  devices, type Device, type InsertDevice,
  locations, type Location, type InsertLocation,
  alerts, type Alert, type InsertAlert,
  type DeviceWithLocation
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Device operations
  getDevice(id: number): Promise<Device | undefined>;
  getDeviceByImei(imei: string): Promise<Device | undefined>;
  getDevicesByUser(userId: number): Promise<Device[]>;
  createDevice(device: InsertDevice): Promise<Device>;
  updateDevice(id: number, data: Partial<Device>): Promise<Device | undefined>;
  deleteDevice(id: number): Promise<boolean>;
  getDevicesWithLocations(userId: number): Promise<DeviceWithLocation[]>;
  getDeviceStats(userId: number): Promise<{
    online: number;
    offline: number;
    alerts: number;
    total: number;
  }>;
  
  // Location operations
  getLocation(id: number): Promise<Location | undefined>;
  getLatestLocationByDevice(deviceId: number): Promise<Location | undefined>;
  getLocationHistory(deviceId: number, limit?: number): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  // Alert operations
  getAlert(id: number): Promise<Alert | undefined>;
  getAlertsByDevice(deviceId: number): Promise<Alert[]>;
  getAlertsByUser(userId: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<Alert | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private devices: Map<number, Device>;
  private locations: Map<number, Location>;
  private alerts: Map<number, Alert>;
  private userId: number;
  private deviceId: number;
  private locationId: number;
  private alertId: number;

  constructor() {
    this.users = new Map();
    this.devices = new Map();
    this.locations = new Map();
    this.alerts = new Map();
    this.userId = 1;
    this.deviceId = 1;
    this.locationId = 1;
    this.alertId = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Device operations
  async getDevice(id: number): Promise<Device | undefined> {
    return this.devices.get(id);
  }

  async getDeviceByImei(imei: string): Promise<Device | undefined> {
    return Array.from(this.devices.values()).find(
      (device) => device.imei === imei
    );
  }

  async getDevicesByUser(userId: number): Promise<Device[]> {
    return Array.from(this.devices.values()).filter(
      (device) => device.userId === userId
    );
  }

  async createDevice(insertDevice: InsertDevice): Promise<Device> {
    const id = this.deviceId++;
    const createdAt = new Date();
    const lastSeen = new Date();
    const device: Device = { 
      ...insertDevice, 
      id, 
      createdAt, 
      lastSeen, 
      isOnline: false, 
      batteryStatus: 'unknown', 
      hasAlert: false 
    };
    this.devices.set(id, device);
    return device;
  }

  async updateDevice(id: number, data: Partial<Device>): Promise<Device | undefined> {
    const device = this.devices.get(id);
    if (!device) return undefined;
    
    const updatedDevice = { ...device, ...data };
    this.devices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteDevice(id: number): Promise<boolean> {
    return this.devices.delete(id);
  }
  
  async getDevicesWithLocations(userId: number): Promise<DeviceWithLocation[]> {
    const devices = await this.getDevicesByUser(userId);
    
    return Promise.all(
      devices.map(async (device) => {
        const location = await this.getLatestLocationByDevice(device.id);
        return {
          ...device,
          location
        };
      })
    );
  }
  
  async getDeviceStats(userId: number): Promise<{
    online: number;
    offline: number;
    alerts: number;
    total: number;
  }> {
    const devices = await this.getDevicesByUser(userId);
    
    const stats = {
      online: 0,
      offline: 0,
      alerts: 0,
      total: devices.length
    };
    
    devices.forEach(device => {
      if (device.isOnline) {
        stats.online++;
      } else {
        stats.offline++;
      }
      
      if (device.hasAlert) {
        stats.alerts++;
      }
    });
    
    return stats;
  }

  // Location operations
  async getLocation(id: number): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async getLatestLocationByDevice(deviceId: number): Promise<Location | undefined> {
    const deviceLocations = Array.from(this.locations.values())
      .filter(location => location.deviceId === deviceId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return deviceLocations[0];
  }

  async getLocationHistory(deviceId: number, limit = 10): Promise<Location[]> {
    return Array.from(this.locations.values())
      .filter(location => location.deviceId === deviceId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = this.locationId++;
    const timestamp = new Date();
    const location: Location = { ...insertLocation, id, timestamp };
    this.locations.set(id, location);
    
    // Update the device's last seen time
    const device = this.devices.get(insertLocation.deviceId);
    if (device) {
      this.updateDevice(device.id, { lastSeen: timestamp });
    }
    
    return location;
  }

  // Alert operations
  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }

  async getAlertsByDevice(deviceId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.deviceId === deviceId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getAlertsByUser(userId: number): Promise<Alert[]> {
    const userDevices = await this.getDevicesByUser(userId);
    const deviceIds = userDevices.map(device => device.id);
    
    return Array.from(this.alerts.values())
      .filter(alert => deviceIds.includes(alert.deviceId))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.alertId++;
    const timestamp = new Date();
    const alert: Alert = { ...insertAlert, id, timestamp, read: false };
    this.alerts.set(id, alert);
    
    // Update the device's alert status
    const device = this.devices.get(insertAlert.deviceId);
    if (device) {
      this.updateDevice(device.id, { hasAlert: true });
    }
    
    return alert;
  }

  async markAlertAsRead(id: number): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert = { ...alert, read: true };
    this.alerts.set(id, updatedAlert);
    
    // Check if there are no more unread alerts for this device
    const deviceAlerts = await this.getAlertsByDevice(alert.deviceId);
    const hasUnreadAlerts = deviceAlerts.some(a => !a.read);
    
    if (!hasUnreadAlerts) {
      // Update the device's alert status
      const device = this.devices.get(alert.deviceId);
      if (device) {
        this.updateDevice(device.id, { hasAlert: false });
      }
    }
    
    return updatedAlert;
  }
}

export const storage = new MemStorage();
