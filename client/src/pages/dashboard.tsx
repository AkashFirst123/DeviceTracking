import { FC, useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { DeviceStats } from "@/components/dashboard/device-stats";
import { DeviceMap } from "@/components/dashboard/device-map";
import { DeviceList } from "@/components/dashboard/device-list";
import { DeviceRegistrationForm } from "@/components/forms/device-registration-form";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw, Filter } from "lucide-react";

const Dashboard: FC = () => {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userId = parseInt(localStorage.getItem("userId") || "1");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search functionality here
    console.log("Searching for:", query);
  };

  const handleRefresh = () => {
    // Refresh device locations
    console.log("Refreshing device locations");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={handleSearch} />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Device Dashboard</h1>
            <p className="text-gray-600">Track and manage your registered smart devices</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              className="inline-flex items-center"
              onClick={() => setRegistrationOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Register New Device
            </Button>
            <Button 
              variant="outline" 
              className="inline-flex items-center"
              onClick={handleRefresh}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Locations
            </Button>
            <Button 
              variant="outline" 
              className="inline-flex items-center"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2">
              <DeviceMap userId={userId} />
            </div>

            {/* Stats and Device List */}
            <div className="flex flex-col space-y-6">
              <DeviceStats userId={userId} />
              <DeviceList userId={userId} limit={4} />
            </div>
          </div>

          {/* Device Registration Form */}
          <DeviceRegistrationForm
            open={registrationOpen}
            onOpenChange={setRegistrationOpen}
          />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
