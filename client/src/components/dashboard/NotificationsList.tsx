import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { Notification } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Bell, CheckCircle, MessageSquare, Info, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru, enUS, de } from "date-fns/locale";

export default function NotificationsList() {
  const { t, language } = useLanguage();
  
  const locales = {
    ru: ru,
    en: enUS,
    de: de
  };
  
  const { data: notifications, isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
  });
  
  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      const res = await apiRequest("PUT", `/api/notifications/${notificationId}`, {
        isRead: true
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });
  
  function getNotificationIcon(type: string) {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  }
  
  function formatTimeAgo(date: string | Date) {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true,
        locale: locales[language] 
      });
    } catch (error) {
      return "";
    }
  }
  
  if (isLoading) {
    return <div className="animate-pulse bg-muted rounded h-20"></div>;
  }
  
  const unreadNotifications = notifications?.filter(notification => !notification.isRead) || [];
  
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-muted border-b border-border">
        <h2 className="text-sm font-medium text-foreground">{t("notifications")}</h2>
      </div>
      
      <div className="divide-y divide-border max-h-80 overflow-y-auto custom-scrollbar">
        {unreadNotifications.length > 0 ? (
          unreadNotifications.slice(0, 3).map((notification) => (
            <div 
              key={notification.id} 
              className={`p-4 ${notification.type === "warning" ? "bg-destructive/10" : ""}`}
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-foreground">{notification.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground md:mt-0">
                    {formatTimeAgo(notification.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {t("noData")}
          </div>
        )}
      </div>
      
      <div className="px-4 py-3 bg-muted border-t border-border text-center">
        <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">{t("allNotifications")}</a>
      </div>
    </div>
  );
}
