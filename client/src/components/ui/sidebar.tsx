import { FC, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useSidebar } from "@/contexts/sidebar-context";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Icons
import {
  LayoutDashboard,
  Smartphone,
  MapPin,
  Bell,
  Settings,
  ChevronFirst,
  ChevronLast,
  Menu,
  Crosshair,
  User,
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
  isActive?: boolean;
}

const SidebarLink: FC<SidebarLinkProps> = ({
  href,
  icon,
  children,
  isActive = false,
}) => {
  return (
    <Link href={href}>
      <a
        className={cn(
          "flex items-center space-x-3 px-3 py-2 rounded-md transition-colors",
          isActive
            ? "bg-primary bg-opacity-20 text-white"
            : "text-gray-300 hover:bg-secondary-600 hover:bg-opacity-50"
        )}
      >
        <span className="text-xl">{icon}</span>
        <span>{children}</span>
      </a>
    </Link>
  );
};

interface SidebarProps {
  className?: string;
}

export const Sidebar: FC<SidebarProps> = ({ className }) => {
  const [location] = useLocation();
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <div
      className={cn(
        "bg-[#0f172a] h-full flex flex-col transition-all duration-300 transform",
        isOpen ? "w-64" : "w-0 sm:w-20",
        className
      )}
    >
      <div className="flex flex-col h-full">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-[#334155]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crosshair className="text-primary text-2xl" />
              {isOpen && (
                <h1 className="text-white font-semibold text-lg">DeviceTracker</h1>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-[#334155] h-8 w-8"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <ChevronFirst /> : <ChevronLast />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            <li>
              <SidebarLink
                href="/"
                icon={<LayoutDashboard />}
                isActive={location === "/"}
              >
                {isOpen && "Dashboard"}
              </SidebarLink>
            </li>
            <li>
              <SidebarLink
                href="/devices"
                icon={<Smartphone />}
                isActive={location === "/devices"}
              >
                {isOpen && "My Devices"}
              </SidebarLink>
            </li>
            <li>
              <SidebarLink
                href="/location-history"
                icon={<MapPin />}
                isActive={location === "/location-history"}
              >
                {isOpen && "Location History"}
              </SidebarLink>
            </li>
            <li>
              <SidebarLink
                href="/alerts"
                icon={<Bell />}
                isActive={location === "/alerts"}
              >
                {isOpen && "Alerts"}
              </SidebarLink>
            </li>
            <li>
              <SidebarLink
                href="/settings"
                icon={<Settings />}
                isActive={location === "/settings"}
              >
                {isOpen && "Settings"}
              </SidebarLink>
            </li>
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-[#334155]">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary-light flex items-center justify-center text-white">
              <User className="h-4 w-4" />
            </div>
            {isOpen && (
              <div>
                <p className="text-white text-sm font-medium">Alex Johnson</p>
                <p className="text-gray-400 text-xs">alex.j@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
