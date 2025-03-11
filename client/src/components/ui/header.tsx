import { FC, useState } from "react";
import { useSidebar } from "@/contexts/sidebar-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Menu, Search, Bell, HelpCircle } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export const Header: FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, setIsOpen } = useSidebar();
  const isMobile = useMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="px-6 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              <Menu />
            </Button>
          )}
          <div className="relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search devices..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="p-1.5 rounded-md hover:bg-gray-100">
            <Bell className="h-5 w-5 text-gray-600" />
          </Button>
          <Button variant="ghost" size="icon" className="p-1.5 rounded-md hover:bg-gray-100">
            <HelpCircle className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </header>
  );
};
