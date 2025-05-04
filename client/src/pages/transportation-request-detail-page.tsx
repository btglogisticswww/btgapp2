import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/hooks/use-language";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransportationRequest } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { formatDate, formatPrice } from "@/lib/formatters";

export default function TransportationRequestDetailPage() {
  const { t } = useLanguage();
  const [, params] = useRoute("/transportation-requests/:id");
  const id = params?.id ? parseInt(params.id) : undefined;
  
  const { data: transportationRequest, isLoading } = useQuery<TransportationRequest>({
    queryKey: [`/api/transportation-requests/${id}`],
    enabled: !!id,
  });

  const { data: order } = useQuery({
    queryKey: [`/api/orders/${transportationRequest?.orderId}`],
    enabled: !!transportationRequest?.orderId,
  });

  const { data: carrier } = useQuery({
    queryKey: [`/api/carriers/${transportationRequest?.carrierId}`],
    enabled: !!transportationRequest?.carrierId,
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </MainLayout>
    );
  }

  if (!transportationRequest) {
    return (
      <MainLayout>
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-2">{t("error")}</h2>
          <p className="text-muted-foreground mb-4">{t("transportation_request_not_found")}</p>
          <Link href="/transportation-requests">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back")}
            </Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>{t("transportationRequests")} #{transportationRequest.id} | BTG+ Logistics</title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link href="/transportation-requests">
              <Button variant="ghost" size="icon" className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">
              {t("transportationRequests")} #{transportationRequest.id}
            </h1>
          </div>
          <Link href={`/transportation-requests/${transportationRequest.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              {t("edit")}
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>{t("requestDetails")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("status")}</p>
                    <Badge variant={getStatusColor(transportationRequest.status)}>
                      {t(transportationRequest.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("deadline")}</p>
                    <p className="font-medium">{formatDate(transportationRequest.deadline)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("price")}</p>
                    <p className="font-medium">{formatPrice(transportationRequest.price)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">{t("createDate")}</p>
                    <p className="font-medium">{formatDate(transportationRequest.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t("updateDate")}</p>
                    <p className="font-medium">{formatDate(transportationRequest.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t("relatedInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("orderLabel")}</p>
                {order ? (
                  <Link href={`/orders/${order.id}`}>
                    <Button variant="link" className="p-0 h-auto font-medium">
                      {t("orderLabel")} #{order.id}
                    </Button>
                  </Link>
                ) : (
                  <p className="text-sm">{t("loading")}...</p>
                )}
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("carrier")}</p>
                {carrier ? (
                  <Link href={`/carriers/${carrier.id}`}>
                    <Button variant="link" className="p-0 h-auto font-medium">
                      {carrier.name}
                    </Button>
                  </Link>
                ) : (
                  <p className="text-sm">{t("loading")}...</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
