import { useQuery } from "@tanstack/react-query";
import { Link, useRoute } from "wouter";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/hooks/use-language";
import { ArrowLeft, Loader2 } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { TransportationRequestForm } from "@/components/transportation-requests/transportation-request-form";
import PageTitle from "@/components/ui/page-title";
import { TransportationRequest } from "@shared/schema";

export default function EditTransportationRequestPage() {
  const { t } = useLanguage();
  const [, params] = useRoute("/transportation-requests/:id/edit");
  const id = params?.id ? parseInt(params.id) : undefined;
  
  const { data: transportationRequest, isLoading } = useQuery<TransportationRequest>({
    queryKey: [`/api/transportation-requests/${id}`],
    enabled: !!id,
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
        <title>{t("editTransportationRequest")} #{transportationRequest.id} | BTG+ Logistics</title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Link href={`/transportation-requests/${transportationRequest.id}`}>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <PageTitle 
            title={t("editTransportationRequest")} 
            description={t("edit_transportation_request_desc")} 
          />
        </div>
        
        <div className="bg-card rounded-md shadow-sm p-6">
          <TransportationRequestForm transportationRequest={transportationRequest} />
        </div>
      </div>
    </MainLayout>
  );
}
