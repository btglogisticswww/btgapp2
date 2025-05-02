import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { getInitials } from "@/lib/utils";
import {
  Home,
  FileText,
  Map,
  Users,
  Truck,
  DollarSign,
  FileText as Document,
  BarChart2,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  LogOut
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { t } = useLanguage();
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const navItems = [
    { path: "/", icon: <Home className="h-5 w-5" />, text: t("dashboard") },
    { path: "/orders", icon: <FileText className="h-5 w-5" />, text: t("orders") },
    { path: "/routes", icon: <Map className="h-5 w-5" />, text: t("routes") },
    { path: "/clients", icon: <Users className="h-5 w-5" />, text: t("clients") },
    { path: "/carriers", icon: <Truck className="h-5 w-5" />, text: t("carriers") },
    { path: "/finances", icon: <DollarSign className="h-5 w-5" />, text: t("finances") },
    { path: "/documents", icon: <Document className="h-5 w-5" />, text: t("documents") },
    { path: "/analytics", icon: <BarChart2 className="h-5 w-5" />, text: t("analytics") },
    { path: "/settings", icon: <Settings className="h-5 w-5" />, text: t("settings") },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <aside 
      className={`animate-sidebar bg-sidebar text-sidebar-foreground border-r border-sidebar-border h-full flex flex-col shadow-md z-20 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border bg-primary h-16">
        <div className="flex items-center">
          <div className="flex h-9 w-9 items-center justify-center rounded bg-white text-primary">
            <span className="text-xl font-bold">БТГ</span>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-xs text-white tracking-wider uppercase">WORLDWIDE</p>
              <p className="text-xs text-white tracking-wider uppercase">LOGISTICS</p>
            </div>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-white hover:text-white/80 focus:outline-none"
        >
          {collapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <ChevronsLeft className="h-5 w-5" />
          )}
        </button>
      </div>
      
      <div className="overflow-y-auto custom-scrollbar flex-1">
        <nav className="mt-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location === item.path 
                    ? "text-sidebar-primary bg-sidebar-accent" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span>{item.text}</span>}
              </Link>
            ))}
          </div>
        </nav>
      </div>
      
      <div className="p-4 border-t border-sidebar-border bg-primary">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-9 w-9 rounded-full bg-white flex items-center justify-center text-primary">
              <span className="font-medium">{user ? getInitials(user.fullName) : "U"}</span>
            </div>
          </div>
          {!collapsed && (
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user?.fullName || user?.username || "Пользователь"}
              </p>
              <p className="text-xs text-white/70">{user?.position || "Сотрудник"}</p>
            </div>
          )}
          <div className={collapsed ? "ml-auto" : "ml-auto"}>
            <button 
              onClick={handleLogout}
              className="text-white hover:text-white/80"
              title={t("logout")}
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
