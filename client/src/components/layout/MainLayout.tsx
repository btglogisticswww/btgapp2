import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import Header, { NotificationPanel } from "./Header";
import { useLanguage } from "@/hooks/use-language";

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export default function MainLayout({ children, title }: MainLayoutProps) {
  const { t } = useLanguage();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const toggleNotificationPanel = () => {
    setNotificationPanelOpen(!notificationPanelOpen);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        setCollapsed={setSidebarCollapsed} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={title} 
          toggleSidebar={toggleSidebar} 
          toggleNotificationPanel={toggleNotificationPanel} 
        />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
      
      {/* Notification Panel */}
      <NotificationPanel 
        isOpen={notificationPanelOpen} 
        onClose={() => setNotificationPanelOpen(false)} 
      />
    </div>
  );
}
