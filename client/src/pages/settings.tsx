import { FC } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Bell, Shield, Map, UserCog } from "lucide-react";

const Settings: FC = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
            <p className="text-gray-600">Configure your account and application preferences</p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="account" className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="account" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <UserCog className="mr-2 h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Shield className="mr-2 h-4 w-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="maps" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                <Map className="mr-2 h-4 w-4" />
                Maps
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account information and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" defaultValue="akashrawat" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="gmail@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input id="fullname" defaultValue="Akash Rawat" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" defaultValue="+917619854195" />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Manage how you receive alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">Receive alerts via email</p>
                      </div>
                      <Switch id="email-notifications" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-gray-500">Receive alerts on your device</p>
                      </div>
                      <Switch id="push-notifications" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="offline-alerts">Offline Device Alerts</Label>
                        <p className="text-sm text-gray-500">Get notified when a device goes offline</p>
                      </div>
                      <Switch id="offline-alerts" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="battery-alerts">Low Battery Alerts</Label>
                        <p className="text-sm text-gray-500">Get notified on low battery status</p>
                      </div>
                      <Switch id="battery-alerts" defaultChecked={true} />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your data and privacy options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="location-history">Save Location History</Label>
                        <p className="text-sm text-gray-500">Store past device locations</p>
                      </div>
                      <Switch id="location-history" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="data-analytics">Share Analytics Data</Label>
                        <p className="text-sm text-gray-500">Help improve our service</p>
                      </div>
                      <Switch id="data-analytics" defaultChecked={false} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="third-party">Third Party Integration</Label>
                        <p className="text-sm text-gray-500">Allow connection with other services</p>
                      </div>
                      <Switch id="third-party" defaultChecked={false} />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      Delete All Data
                    </Button>
                    <Button>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="maps">
              <Card>
                <CardHeader>
                  <CardTitle>Map Settings</CardTitle>
                  <CardDescription>Configure map preferences and display options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="default-map-view">Default Map View</Label>
                        <p className="text-sm text-gray-500">Standard map display</p>
                      </div>
                      <Switch id="default-map-view" defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="satellite-view">Satellite View</Label>
                        <p className="text-sm text-gray-500">Show satellite imagery when available</p>
                      </div>
                      <Switch id="satellite-view" defaultChecked={false} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="traffic-data">Traffic Data</Label>
                        <p className="text-sm text-gray-500">Display traffic information on maps</p>
                      </div>
                      <Switch id="traffic-data" defaultChecked={false} />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-location">Default Location</Label>
                      <Input id="default-location" defaultValue="Current Location" />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <Button>
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Settings;
