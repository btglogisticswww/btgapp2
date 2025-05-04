import { useRoute } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { TransportationRequestForm } from "@/components/transportation-requests/transportation-request-form";
import { TransportationRequest } from "@shared/schema";

export default function EditTransportationRequestPage() {
  const { t } = useLanguage();
  const [matched, params] = useRoute("/transportation-requests/:id/edit");
  const requestId = params?.id ? parseInt(params.id) : 0;

  const { data: transportationRequest, isLoading } = useQuery<TransportationRequest>({
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

  return (
    <MainLayout title={isLoading ? t("loading") : `${t("editTransportationRequest")} #${requestId}`}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isLoading
            ? t("loading")
            : `${t("editTransportationRequest")} #${requestId}`}
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          transportationRequest && (
            <TransportationRequestForm transportationRequest={transportationRequest} />
          )
        )}
      </div>
    </MainLayout>
  );
}
