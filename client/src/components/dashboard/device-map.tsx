import { FC, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Minus, Locate, Fullscreen, MoreVertical, Smartphone, Tablet, Watch, Laptop } from "lucide-react";
import { DeviceWithLocation } from "@shared/schema";

interface DeviceMapProps {
  userId: number;
}

export const DeviceMap: FC<DeviceMapProps> = ({ userId }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  
  const { data: devices, isLoading } = useQuery<DeviceWithLocation[]>({
    queryKey: ["/api/devices-with-locations", userId],
    queryFn: () => fetch(`/api/devices-with-locations?userId=${userId}`).then(res => res.json()),
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !mapLoaded && mapRef.current) {
      // Load Leaflet when component mounts
      const loadLeaflet = async () => {
        // Dynamically import leaflet
        const L = await import('leaflet');
        
        // Load leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        
        // Initialize the map
        const mapInstance = L.map(mapRef.current).setView([37.7749, -122.4194], 10);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapInstance);
        
        setMap(mapInstance);
        setMapLoaded(true);
      };
      
      loadLeaflet();
    }
    
    // Cleanup on unmount
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [mapLoaded]);

  // Add device markers to the map
  useEffect(() => {
    if (map && devices && devices.length > 0) {
      // Clear existing markers
      markers.forEach(marker => marker.remove());
      const newMarkers: any[] = [];
      
      // Create custom device icon
      const getDeviceIcon = async (type: string) => {
        const L = await import('leaflet');
        
        const iconMap: Record<string, any> = {
          'smartphone': Smartphone,
          'tablet': Tablet,
          'smartwatch': Watch,
          'laptop': Laptop,
          'other': Smartphone,
        };
        
        const IconComponent = iconMap[type] || iconMap.other;
        
        // Create a custom HTML element for the icon
        const iconHtml = document.createElement('div');
        iconHtml.className = 'h-8 w-8 rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center';
        iconHtml.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><use href="#${IconComponent.name.toLowerCase()}"></use></svg>`;
        
        return L.divIcon({
          html: iconHtml,
          className: '',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
      };
      
      // Add markers for each device with location
      devices.forEach(async (device) => {
        if (device.location) {
          const icon = await getDeviceIcon(device.type);
          
          const marker = L.marker(
            [parseFloat(device.location.latitude), parseFloat(device.location.longitude)],
            { icon }
          ).addTo(map);
          
          marker.bindPopup(`
            <b>${device.name}</b><br>
            ${device.isOnline ? '<span class="text-green-500">Online</span>' : '<span class="text-gray-500">Offline</span>'}<br>
            Last seen: ${new Date(device.lastSeen).toLocaleString()}<br>
            IMEI: ${device.imei}
          `);
          
          newMarkers.push(marker);
        }
      });
      
      setMarkers(newMarkers);
      
      // Adjust map view to fit all markers if there are any
      if (newMarkers.length > 0) {
        const group = L.featureGroup(newMarkers);
        map.fitBounds(group.getBounds(), { padding: [30, 30] });
      }
    }
  }, [map, devices]);

  // Map controls
  const handleZoomIn = () => {
    if (map) map.zoomIn();
  };
  
  const handleZoomOut = () => {
    if (map) map.zoomOut();
  };
  
  const handleLocateMe = async () => {
    if (map && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-gray-800">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-200">
        <CardTitle className="text-gray-800">Device Locations</CardTitle>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Fullscreen className="h-4 w-4 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <MoreVertical className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-96 bg-gray-100 relative" ref={mapRef}>
          {/* Map Controls */}
          <div className="absolute right-4 bottom-4 flex flex-col space-y-2 z-[400]">
            <Button 
              onClick={handleZoomIn}
              variant="outline" 
              size="icon" 
              className="h-8 w-8 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <Plus className="h-4 w-4 text-gray-700" />
            </Button>
            <Button 
              onClick={handleZoomOut}
              variant="outline" 
              size="icon" 
              className="h-8 w-8 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <Minus className="h-4 w-4 text-gray-700" />
            </Button>
            <Button 
              onClick={handleLocateMe}
              variant="outline" 
              size="icon" 
              className="h-8 w-8 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <Locate className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
          
          {/* SVG Defs for marker icons */}
          <svg className="hidden">
            <symbol id="smartphone" viewBox="0 0 24 24">
              <path d="M17 2H7C5.89543 2 5 2.89543 5 4V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V4C19 2.89543 18.1046 2 17 2Z" />
              <path d="M12 18H12.01" />
            </symbol>
            <symbol id="tablet" viewBox="0 0 24 24">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
              <line x1="12" y1="18" x2="12.01" y2="18" />
            </symbol>
            <symbol id="watch" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="7" />
              <polyline points="12 9 12 12 13.5 13.5" />
              <path d="M16.51 17.35l-.35 3.83a2 2 0 01-2 1.82H9.83a2 2 0 01-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 019.83 1h4.35a2 2 0 012 1.82l.35 3.83" />
            </symbol>
            <symbol id="laptop" viewBox="0 0 24 24">
              <path d="M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 01-.9 1.45H3.62a1 1 0 01-.9-1.45L4 16" />
            </symbol>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};
