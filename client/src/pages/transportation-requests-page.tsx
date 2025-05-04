import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/hooks/use-language";
import { Loader2, Plus, Search } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import PageTitle from "@/components/ui/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TransportationRequestList } from "@/components/transportation-requests/transportation-request-list";
import { TransportationRequest } from "@shared/schema";

export default function TransportationRequestsPage() {
  const { t } = useLanguage();
  
  const { data: transportationRequests, isLoading } = useQuery<TransportationRequest[]>({
    queryKey: ["/api/transportation-requests"],
  });

  return (
    <MainLayout>
      <Helmet>
        <title>{t("transportationRequests")} | BTG+ Logistics</title>
      </Helmet>
      
      <div className="container mx-auto p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <PageTitle title={t("transportationRequests")} description={t("manage_transportation_requests_desc")} />
          <Link href="/transportation-requests/create">
            <Button className="w-full sm:w-auto mt-4 sm:mt-0">
              <Plus className="mr-2 h-4 w-4" />
              {t("addTransportationRequest")}
            </Button>
          </Link>
        </div>
        
        <div className="bg-card rounded-md shadow-sm">
          <div className="p-4 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-9" 
                  placeholder={t("search_transportation_requests")} 
                />
              </div>
            </div>
          </div>
          
          <div className="p-4">
            {isLoading ? (
              <div className="min-h-[300px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-border" />
              </div>
            ) : (
              <TransportationRequestList 
                transportationRequests={transportationRequests || []} 
                isStandalone={true}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
