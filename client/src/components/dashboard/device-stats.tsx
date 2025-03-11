import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, WifiOff, AlertCircle, Smartphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface DeviceStatsProps {
  userId: number;
}

export const DeviceStats: FC<DeviceStatsProps> = ({ userId }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/device-stats", userId],
    queryFn: () => fetch(`/api/device-stats?userId=${userId}`).then(res => res.json()),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-gray-800">Device Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Online</p>
                <p className="text-xl font-semibold text-blue-600">{stats?.online || 0}</p>
              </div>
              <Wifi className="text-blue-500 h-5 w-5" />
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Offline</p>
                <p className="text-xl font-semibold text-gray-600">{stats?.offline || 0}</p>
              </div>
              <WifiOff className="text-gray-500 h-5 w-5" />
            </div>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Alerts</p>
                <p className="text-xl font-semibold text-red-600">{stats?.alerts || 0}</p>
              </div>
              <AlertCircle className="text-red-500 h-5 w-5" />
            </div>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total</p>
                <p className="text-xl font-semibold text-purple-600">{stats?.total || 0}</p>
              </div>
              <Smartphone className="text-purple-500 h-5 w-5" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
