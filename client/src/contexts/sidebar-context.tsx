import { createContext, useContext, useState, ReactNode, FC } from "react";
import { useMobile } from "@/hooks/use-mobile";

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarProviderProps {
  children: ReactNode;
}

export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
