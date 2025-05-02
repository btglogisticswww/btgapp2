import { useLanguage } from "@/hooks/use-language";
import MainLayout from "@/components/layout/MainLayout";
import StatCard from "@/components/dashboard/StatCard";
import OrdersTable from "@/components/dashboard/OrdersTable";
import ActivityChart from "@/components/dashboard/ActivityChart";
import TaskList from "@/components/dashboard/TaskList";
import RoutesList from "@/components/dashboard/RoutesList";
import NotificationsList from "@/components/dashboard/NotificationsList";
import { useQuery } from "@tanstack/react-query";
import { formatCurrency } from "@/lib/utils";
import { 
  FileText, 
  DollarSign, 
  CheckCircle, 
  ListChecks 
} from "lucide-react";

export default function DashboardPage() {
  const { t } = useLanguage();
  
  // Simulating data fetching that would come from API endpoints
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
    queryFn: () => {
      // This would be replaced with real API call
      return Promise.resolve({
        activeOrders: 24,
        revenue: 1200000,
        completedOrders: 18,
        pendingTasks: 5
      });
    }
  });
  
  return (
    <MainLayout title={t("dashboard")}>
      {/* Dashboard Overview */}
      <div className="mb-8">
        {/* Stats Overview */}
        <h2 className="text-xl font-semibold text-foreground mb-4">{t("keyMetrics")}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card: Active Orders */}
          <StatCard 
            icon={<FileText className="h-6 w-6" />}
            title={t("activeOrders")}
            value={stats?.activeOrders || 0}
            subtext={t("currentlyActive")}
          />
          
          {/* Card: Revenue */}
          <StatCard 
            icon={<DollarSign className="h-6 w-6" />}
            title={t("revenue")}
            value={formatCurrency(stats?.revenue || 0)}
            subtext={t("currentMonth")}
          />
          
          {/* Card: Completed Orders */}
          <StatCard 
            icon={<CheckCircle className="h-6 w-6" />}
            title={t("completedOrders")}
            value={stats?.completedOrders || 0}
            subtext={t("lastWeek")}
          />
          
          {/* Card: Tasks */}
          <StatCard 
            icon={<ListChecks className="h-6 w-6" />}
            title={t("tasks")}
            value={stats?.pendingTasks || 0}
            subtext={t("needAttention")}
          />
        </div>
      </div>
      
      {/* Main Dashboard Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders & Activity Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Orders Table */}
          <OrdersTable limit={4} showViewAll={true} />
          
          {/* Activity Chart */}
          <ActivityChart />
        </div>
        
        {/* Activity Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tasks */}
          <TaskList />
          
          {/* Active Routes */}
          <RoutesList />
          
          {/* Notifications */}
          <NotificationsList />
        </div>
      </div>
    </MainLayout>
  );
}
