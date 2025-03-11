import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const deviceTypes = [
  'smartphone',
  'tablet',
  'laptop',
  'smartwatch',
  'other'
] as const;

export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  imei: text("imei").notNull().unique(),
  email: text("email").notNull(),
  notes: text("notes"),
  isOnline: boolean("is_online").default(false),
  batteryStatus: text("battery_status").default("unknown"),
  hasAlert: boolean("has_alert").default(false),
  lastSeen: timestamp("last_seen").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDeviceSchema = createInsertSchema(devices).pick({
  userId: true,
  name: true,
  type: true,
  imei: true,
  email: true,
  notes: true,
});

export const deviceSchema = createInsertSchema(devices);
export type InsertDevice = z.infer<typeof insertDeviceSchema>;
export type Device = typeof devices.$inferSelect;

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  accuracy: integer("accuracy"),
  locationName: text("location_name"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertLocationSchema = createInsertSchema(locations).pick({
  deviceId: true,
  latitude: true,
  longitude: true,
  accuracy: true,
  locationName: true,
});

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  deviceId: integer("device_id").notNull(),
  type: text("type").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertAlertSchema = createInsertSchema(alerts).pick({
  deviceId: true,
  type: true,
  message: true,
});

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = typeof alerts.$inferSelect;

export type DeviceWithLocation = Device & {
  location?: Location;
};
