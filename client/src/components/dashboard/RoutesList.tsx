import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { Route } from "@shared/schema";
import { getStatusColors } from "@/lib/utils";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";

export default function RoutesList() {
  const { t } = useLanguage();
  
  const { data: routes, isLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });
  
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-muted border-b border-border flex justify-between items-center">
          <h2 className="text-sm font-medium text-foreground">{t("activeRoutes")}</h2>
          <Link href="/routes" className="text-sm text-primary hover:text-primary/80">
            {t("details")} →
          </Link>
        </div>
        <div className="p-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  const activeRoutes = routes?.filter(route => 
    route.status === "active" || route.status === "pending"
  ) || [];
  
  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-muted border-b border-border flex justify-between items-center">
        <h2 className="text-sm font-medium text-foreground">{t("activeRoutes")}</h2>
        <Link href="/routes" className="text-sm text-primary hover:text-primary/80">
          {t("details")} →
        </Link>
      </div>
      
      <div className="divide-y divide-border">
        {activeRoutes.length > 0 ? (
          activeRoutes.slice(0, 3).map((route) => {
            const statusColors = getStatusColors(route.status);
            
            return (
              <div key={route.id} className="p-4 hover:bg-muted/50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-foreground">
                    {route.startPoint} → {route.endPoint}
                  </h3>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors.bg} ${statusColors.text}`}>
                    {t(route.status)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                  <span>Заказ #{route.orderId}</span>
                  {route.startDate && route.endDate && (
                    <span>
                      {new Date(route.startDate).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })} - 
                      {new Date(route.endDate).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                    </span>
                  )}
                </div>
                <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                  <div className={route.status === "active" ? "bg-green-500 h-1.5 rounded-full" : 
                                 route.status === "pending" ? "bg-blue-500 h-1.5 rounded-full" :
                                 "bg-yellow-500 h-1.5 rounded-full"}
                      style={{ width: `${route.progress || 0}%` }}></div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {t("noData")}
          </div>
        )}
      </div>
    </div>
  );
}
