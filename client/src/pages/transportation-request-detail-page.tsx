import { useRoute, Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/components/layout/MainLayout";
import { TransportationRequest, Order, Carrier } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusColor } from "@/lib/utils";
import { formatDate, formatPrice } from "@/lib/formatters";
import { ArrowLeft, Calendar, FileEdit, FileText, TruckIcon, MapPin, DollarSign, MessageCircle } from "lucide-react";

export default function TransportationRequestDetailPage() {
  const { t } = useLanguage();
  const [matched, params] = useRoute("/transportation-requests/:id");
  const requestId = params?.id ? parseInt(params.id) : 0;

  const { data: request, isLoading: isLoadingRequest } = useQuery<TransportationRequest>({
    queryKey: ["/api/transportation-requests", requestId],
    queryFn: async () => {
      const response = await fetch(`/api/transportation-requests/${requestId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transportation request");
      }
      return await response.json();
    },
    enabled: !!requestId,
  });

  const { data: order, isLoading: isLoadingOrder } = useQuery<Order>({
    queryKey: ["/api/orders", request?.orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${request?.orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      return await response.json();
    },
    enabled: !!request?.orderId,
  });

  const { data: carrier, isLoading: isLoadingCarrier } = useQuery<Carrier>({
    queryKey: ["/api/carriers", request?.carrierId],
    queryFn: async () => {
      const response = await fetch(`/api/carriers/${request?.carrierId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch carrier");
      }
      return await response.json();
    },
    enabled: !!request?.carrierId,
  });

  const isLoading = isLoadingRequest || isLoadingOrder || isLoadingCarrier;

  if (isLoading) {
    return (
      <MainLayout>
        <Helmet>
          <title>{t("transportationRequestDetails")} | BTG Logistics</title>
        </Helmet>
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </MainLayout>
    );
  }

  if (!request) {
    return (
      <MainLayout>
        <Helmet>
          <title>{t("transportationRequestDetails")} | BTG Logistics</title>
        </Helmet>
        <div className="p-6">
          <Link href="/transportation-requests">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("back")}
            </Button>
          </Link>
          <Card>
            <CardContent className="p-6 text-center">
              <p>{t("noData")}</p>
              <p>{t("Transportation request not found")}</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Helmet>
        <title>
          {t("transportationRequestDetails")} #{request.id} | BTG Logistics
        </title>
      </Helmet>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/transportation-requests">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t("back")}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">
              {t("transportationRequestDetails")} #{request.id}
            </h1>
            <Badge
              variant="outline"
              className={`${getStatusColor(request.status)}`}
            >
              {t(request.status)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/transportation-requests/${request.id}/edit`}>
              <Button variant="ghost">
                <FileEdit className="mr-2 h-4 w-4" />
                {t("edit")}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("generalInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <TruckIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">{t("carrier")}:</span>
                <span>{carrier?.name || t("unknown")}</span>
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">{t("orderLabel")}:</span>
                <Link href={`/orders/${request.orderId}`} className="text-primary hover:underline">
                  #{request.orderId} - {order?.orderNumber || ""}
                </Link>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">{t("deadline")}:</span>
                <span>{formatDate(request.deadline)}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-muted-foreground mr-1">{t("price")}:</span>
                <span>{formatPrice(request.price)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("orderDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order ? (
                <>
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground mr-1">{t("orderNumber")}:</span>
                    <span>{order.orderNumber}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground mr-1">{t("origin")}:</span>
                    <span>{order.originAddress}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground mr-1">{t("destination")}:</span>
                    <span>{order.destinationAddress}</span>
                  </div>
                </>
              ) : (
                <div className="text-muted-foreground text-center py-4">
                  {t("orderNotFound")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {request.notes && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t("notes")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start">
                <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground mt-1" />
                <p className="whitespace-pre-wrap">{request.notes}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
