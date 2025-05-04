import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/hooks/use-language";
import { ArrowLeft } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { TransportationRequestForm } from "@/components/transportation-requests/transportation-request-form";
import PageTitle from "@/components/ui/page-title";
import { Order } from "@shared/schema";

export default function CreateTransportationRequestPage() {
  const { t } = useLanguage();
  const [matchesOrderRoute, orderParams] = useRoute("/orders/:orderId/transportation-requests/create");
  const orderId = matchesOrderRoute && orderParams?.orderId ? parseInt(orderParams.orderId) : undefined;
  
  const { data: order } = useQuery<Order>({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !!orderId,
  });

  return (
    <MainLayout>
      <Helmet>
        <title>{t("addTransportationRequest")} | BTG+ Logistics</title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Link href={matchesOrderRoute ? `/orders/${orderId}` : "/transportation-requests"}>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <PageTitle 
            title={t("addTransportationRequest")} 
            description={order ? t("add_transportation_request_to_order", { orderId: order.id }) : t("add_transportation_request_desc")} 
          />
        </div>
        
        <div className="bg-card rounded-md shadow-sm p-6">
          <TransportationRequestForm preselectedOrderId={orderId} />
        </div>
      </div>
    </MainLayout>
  );
}
