import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { TransportationRequest } from "@shared/schema";
import TransportationRequestCard from "./transportation-request-card";

export interface TransportationRequestListProps {
  transportationRequests?: TransportationRequest[];
  orderId?: number;
  isStandalone?: boolean;
}

export function TransportationRequestList({
  transportationRequests,
  orderId,
  isStandalone = false
}: TransportationRequestListProps) {
  const { t } = useLanguage();

  // If transportationRequests is provided, use it directly
  // Otherwise, fetch transportation requests for the given orderId
  const { data: fetchedRequests, isLoading } = useQuery<TransportationRequest[]>({
    queryKey: ["/api/transportation-requests", orderId ? { orderId } : null],
    queryFn: async () => {
      const url = orderId
        ? `/api/orders/${orderId}/transportation-requests`
        : "/api/transportation-requests";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch transportation requests");
      }
      return await response.json();
    },
    enabled: !transportationRequests && !!orderId,
  });

  // Use provided transportationRequests or fetchedRequests
  const requests = transportationRequests || fetchedRequests || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">{t("no_transportation_requests")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {requests.map((request) => (
        <TransportationRequestCard
          key={request.id}
          transportationRequest={request}
          isStandalone={isStandalone}
        />
      ))}
    </div>
  );
}
