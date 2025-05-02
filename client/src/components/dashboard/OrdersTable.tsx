import { useLanguage } from "@/hooks/use-language";
import { formatCurrency, formatDate, getStatusColors } from "@/lib/utils";
import { Order } from "@shared/schema";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface OrdersTableProps {
  limit?: number;
  showViewAll?: boolean;
}

export default function OrdersTable({ limit = 4, showViewAll = true }: OrdersTableProps) {
  const { t } = useLanguage();
  
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });
  
  // Take only the first N orders if limit is specified
  const displayedOrders = limit ? orders?.slice(0, limit) : orders;
  
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-muted flex justify-between items-center">
          <h2 className="text-sm font-medium text-foreground">{t("recentOrders")}</h2>
          {showViewAll && (
            <Link href="/orders" className="text-sm text-primary hover:text-primary/80">
              {t("allOrders")} →
            </Link>
          )}
        </div>
        <div className="p-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-card rounded-lg overflow-hidden">
        <div className="px-4 py-3 bg-muted">
          <h2 className="text-sm font-medium text-foreground">{t("recentOrders")}</h2>
        </div>
        <div className="p-4 text-destructive">
          {(error as Error).message || t("noData")}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-card rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-muted flex justify-between items-center">
        <h2 className="text-sm font-medium text-foreground">{t("recentOrders")}</h2>
        {showViewAll && (
          <Link href="/orders" className="text-sm text-primary hover:text-primary/80">
            {t("allOrders")} →
          </Link>
        )}
      </div>
      
      <div className="overflow-x-auto">
        {displayedOrders && displayedOrders.length > 0 ? (
          <table className="min-w-full">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("id")}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("client")}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("route")}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("status")}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("date")}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t("price")}
                </th>
              </tr>
            </thead>
            <tbody className="bg-card">
              {displayedOrders.map((order) => {
                const statusColors = getStatusColors(order.status);
                return (
                  <tr key={order.id} className="hover:bg-muted/50 cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      <Link href={`/orders/${order.id}`}>
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{order.clientId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">{order.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors.bg} ${statusColors.text}`}>
                        {t(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{formatDate(order.orderDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-card-foreground">
                      {formatCurrency(order.price)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {t("noData")}
          </div>
        )}
      </div>
      
      {displayedOrders && displayedOrders.length > 0 && (
        <div className="px-4 py-3 bg-muted flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted">
              {t("previous")}
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-foreground bg-card hover:bg-muted">
              {t("next")}
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {t("showing")} <span className="font-medium">1</span> - <span className="font-medium">{displayedOrders.length}</span> {t("of")} <span className="font-medium">{orders?.length}</span> {t("orders").toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
