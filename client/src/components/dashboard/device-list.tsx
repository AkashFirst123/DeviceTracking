import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Device } from "@shared/schema";
import { Link } from "wouter";
import { MoreVertical, Clock, MapPin, Smartphone, Tablet, Laptop, Watch, Download, FileText } from "lucide-react";
import { downloadDevicePDF, downloadDeviceListPDF } from "@/lib/device-api";
import { formatDistanceToNow } from "date-fns";

interface DeviceListProps {
  userId: number;
  limit?: number;
  showViewAll?: boolean;
}

export const DeviceList: FC<DeviceListProps> = ({ userId, limit, showViewAll = true }) => {
  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ["/api/devices", userId],
    queryFn: () => fetch(`/api/devices?userId=${userId}`).then(res => res.json()),
  });

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smartphone':
        return <Smartphone className="h-5 w-5" />;
      case 'tablet':
        return <Tablet className="h-5 w-5" />;
      case 'laptop':
        return <Laptop className="h-5 w-5" />;
      case 'smartwatch':
        return <Watch className="h-5 w-5" />;
      default:
        return <Smartphone className="h-5 w-5" />;
    }
  };

  const getDeviceTypeColor = (type: string) => {
    switch (type) {
      case 'smartphone':
        return 'bg-blue-100 text-blue-500';
      case 'tablet':
        return 'bg-purple-100 text-purple-500';
      case 'laptop':
        return 'bg-red-100 text-red-500';
      case 'smartwatch':
        return 'bg-green-100 text-green-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const getStatusIndicator = (device: Device) => {
    if (device.hasAlert) {
      return (
        <>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-500 ml-2 mr-1"></span>
          <span className="text-xs text-gray-500">Alert</span>
        </>
      );
    }
    
    if (device.batteryStatus === 'low') {
      return (
        <>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 ml-2 mr-1"></span>
          <span className="text-xs text-gray-500">Low Battery</span>
        </>
      );
    }
    
    return (
      <>
        <span className={`inline-block h-1.5 w-1.5 rounded-full ${device.isOnline ? 'bg-green-500' : 'bg-gray-500'} ml-2 mr-1`}></span>
        <span className="text-xs text-gray-500">{device.isOnline ? 'Online' : 'Offline'}</span>
      </>
    );
  };

  const formatLastSeen = (date: Date | null) => {
    if (!date) return 'Never';
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-200">
          <CardTitle className="text-gray-800">
            <Skeleton className="h-6 w-32" />
          </CardTitle>
          {showViewAll && <Skeleton className="h-4 w-16" />}
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-4 w-40 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
                <Skeleton className="h-3 w-full mt-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayDevices = limit ? devices?.slice(0, limit) : devices;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-gray-200">
        <CardTitle className="text-gray-800">Registered Devices</CardTitle>
        <div className="flex items-center space-x-2">
          {/* PDF Download button for all devices */}
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => downloadDeviceListPDF()}
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </Button>
          
          {showViewAll && (
            <Link href="/devices">
              <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium p-0">
                View All
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {displayDevices?.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">No devices registered yet.</p>
              <Button className="mt-4" variant="outline">Register a Device</Button>
            </div>
          ) : (
            displayDevices?.map((device) => (
              <div key={device.id} className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-lg ${getDeviceTypeColor(device.type)} flex items-center justify-center`}>
                      {getDeviceIcon(device.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{device.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 font-mono">IMEI: {device.imei}</span>
                        {getStatusIndicator(device)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadDevicePDF(device.id);
                      }}
                      title="Download device report"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-gray-400 hover:text-gray-800"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <Clock className="text-gray-400 h-3 w-3 mr-1" />
                  <span>Last seen: {device.lastSeen ? formatLastSeen(device.lastSeen) : 'Never'}</span>
                  <span className="mx-2">•</span>
                  <MapPin className="text-gray-400 h-3 w-3 mr-1" />
                  <span>Location unavailable</span>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
