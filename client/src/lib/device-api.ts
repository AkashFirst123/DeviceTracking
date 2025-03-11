import { apiRequest } from "@/lib/queryClient";
import { Device, Location, InsertDevice, InsertLocation } from "@shared/schema";

export async function registerDevice(deviceData: Omit<InsertDevice, "userId">): Promise<Device> {
  const userId = parseInt(localStorage.getItem("userId") || "1");
  const res = await apiRequest("POST", "/api/devices", { 
    ...deviceData, 
    userId 
  });
  return res.json();
}

export async function getDevices(): Promise<Device[]> {
  const userId = parseInt(localStorage.getItem("userId") || "1");
  const res = await fetch(`/api/devices?userId=${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch devices: ${res.statusText}`);
  }
  return res.json();
}

export async function getDeviceById(id: number): Promise<Device> {
  const res = await fetch(`/api/devices/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch device: ${res.statusText}`);
  }
  return res.json();
}

export async function updateDevice(id: number, data: Partial<Device>): Promise<Device> {
  const res = await apiRequest("PATCH", `/api/devices/${id}`, data);
  return res.json();
}

export async function deleteDevice(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/devices/${id}`, undefined);
}

export async function getDevicesWithLocations(): Promise<Device[]> {
  const userId = parseInt(localStorage.getItem("userId") || "1");
  const res = await fetch(`/api/devices-with-locations?userId=${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch devices with locations: ${res.statusText}`);
  }
  return res.json();
}

export async function updateDeviceLocation(
  deviceId: number,
  locationData: Omit<InsertLocation, "deviceId">
): Promise<Location> {
  const res = await apiRequest("POST", "/api/locations", {
    ...locationData,
    deviceId
  });
  return res.json();
}

export async function getDeviceLocationHistory(deviceId: number, limit?: number): Promise<Location[]> {
  const url = limit
    ? `/api/locations/${deviceId}?limit=${limit}`
    : `/api/locations/${deviceId}`;
  
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch location history: ${res.statusText}`);
  }
  return res.json();
}

export async function getDeviceStats(): Promise<{
  online: number;
  offline: number;
  alerts: number;
  total: number;
}> {
  const userId = parseInt(localStorage.getItem("userId") || "1");
  const res = await fetch(`/api/device-stats?userId=${userId}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch device stats: ${res.statusText}`);
  }
  return res.json();
}

/**
 * Download a PDF report for a specific device
 * @param deviceId The ID of the device to generate a PDF report for
 */
export function downloadDevicePDF(deviceId: number): void {
  const userId = parseInt(localStorage.getItem("userId") || "1");
  // Open the PDF download in a new tab
  window.open(`/api/download/device/${deviceId}?userId=${userId}`, '_blank');
}

/**
 * Download a PDF report containing all user devices
 */
export function downloadDeviceListPDF(): void {
  const userId = parseInt(localStorage.getItem("userId") || "1");
  // Open the PDF download in a new tab
  window.open(`/api/download/devices?userId=${userId}`, '_blank');
}
