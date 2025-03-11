import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/contexts/sidebar-context";
import Dashboard from "@/pages/dashboard";
import Devices from "@/pages/devices";
import LocationHistory from "@/pages/location-history";
import Alerts from "@/pages/alerts";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <SidebarProvider>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/devices" component={Devices} />
        <Route path="/location-history" component={LocationHistory} />
        <Route path="/alerts" component={Alerts} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </SidebarProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
