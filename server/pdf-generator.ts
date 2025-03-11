import PDFDocument from 'pdfkit';
import { Device, Location } from '@shared/schema';
import { Response } from 'express';

export function generateDevicePDF(res: Response, device: Device, locations?: Location[]) {
  // Create a document
  const doc = new PDFDocument({ margin: 50 });

  // Pipe its output to the response
  doc.pipe(res);

  // Set the title
  doc.fontSize(25).text('Device Information', { align: 'center' });
  doc.moveDown();

  // Add device details
  doc.fontSize(14).text('Basic Information', { underline: true });
  doc.moveDown(0.5);
  
  doc.fontSize(12);
  doc.text(`Device Name: ${device.name}`);
  doc.text(`Type: ${device.type}`);
  doc.text(`IMEI: ${device.imei}`);
  doc.text(`Associated Email: ${device.email}`);
  
  if (device.notes) {
    doc.text(`Notes: ${device.notes}`);
  }
  
  doc.text(`Status: ${device.isOnline ? 'Online' : 'Offline'}`);
  doc.text(`Battery: ${device.batteryStatus || 'Unknown'}`);
  doc.text(`Last Seen: ${device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Never'}`);
  
  doc.moveDown();

  // Add location history if available
  if (locations && locations.length > 0) {
    doc.fontSize(14).text('Location History', { underline: true });
    doc.moveDown(0.5);
    
    locations.forEach((location, index) => {
      doc.fontSize(12).text(`Location #${index + 1}`, { underline: true });
      doc.text(`Timestamp: ${new Date(location.timestamp || '').toLocaleString()}`);
      doc.text(`Coordinates: ${location.latitude}, ${location.longitude}`);
      
      if (location.locationName) {
        doc.text(`Location Name: ${location.locationName}`);
      }
      
      if (location.accuracy) {
        doc.text(`Accuracy: ${location.accuracy} meters`);
      }
      
      doc.moveDown(0.5);
    });
  }

  // Add a footer
  doc.fontSize(10).text(
    `Generated on ${new Date().toLocaleString()}`,
    { align: 'center' }
  );

  // Finalize the PDF and end the stream
  doc.end();
}

export function generateDeviceListPDF(res: Response, devices: Device[]) {
  // Create a document
  const doc = new PDFDocument({ margin: 50 });

  // Pipe its output to the response
  doc.pipe(res);

  // Set the title
  doc.fontSize(25).text('Device Tracking System', { align: 'center' });
  doc.fontSize(18).text('Device List Report', { align: 'center' });
  doc.moveDown();

  // Add date
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });
  doc.moveDown();

  // Add device summary
  doc.fontSize(14).text('Summary', { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12);
  doc.text(`Total Devices: ${devices.length}`);
  doc.text(`Online Devices: ${devices.filter(d => d.isOnline).length}`);
  doc.text(`Offline Devices: ${devices.filter(d => !d.isOnline).length}`);
  doc.text(`Devices with Alerts: ${devices.filter(d => d.hasAlert).length}`);
  doc.moveDown();

  // Add device list
  doc.fontSize(14).text('Device List', { underline: true });
  doc.moveDown(0.5);

  if (devices.length === 0) {
    doc.fontSize(12).text('No devices registered.');
  } else {
    devices.forEach((device, index) => {
      doc.fontSize(12).text(`${index + 1}. ${device.name}`, { underline: true });
      doc.text(`Type: ${device.type}`);
      doc.text(`IMEI: ${device.imei}`);
      doc.text(`Email: ${device.email}`);
      doc.text(`Status: ${device.isOnline ? 'Online' : 'Offline'}`);
      doc.text(`Last Seen: ${device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Never'}`);
      doc.moveDown();
    });
  }

  // Add footer
  const pageCount = doc.bufferedPageRange().count;
  for (let i = 0; i < pageCount; i++) {
    doc.switchToPage(i);
    doc.fontSize(10).text(
      `Page ${i + 1} of ${pageCount}`, 
      { align: 'center' }
    );
  }

  // Finalize the PDF and end the stream
  doc.end();
}