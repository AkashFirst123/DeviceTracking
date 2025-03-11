import { FC } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Filter, CheckCircle } from "lucide-react";

const Alerts: FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Device Alerts</h1>
            <p className="text-gray-600">Manage notifications and alerts for your devices</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button variant="outline" className="inline-flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filter Alerts
            </Button>
            <Button variant="outline" className="inline-flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark All as Read
            </Button>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-800">Alert History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Alerts</h3>
                  <p className="text-gray-500">
                    Any alerts or notifications about your devices will appear here.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Alerts;
