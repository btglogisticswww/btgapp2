import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { TransportationRequestList } from "@/components/transportation-requests/transportation-request-list";
import { TransportationRequest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TransportationRequestsPage() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: transportationRequests, isLoading } = useQuery<TransportationRequest[]>({
    queryKey: ["/api/transportation-requests"],
  });

  // Filter transportation requests based on search term and status
  const filteredRequests = transportationRequests?.filter((request) => {
    const matchesSearch = 
      request.id.toString().includes(searchTerm) ||
      request.orderId.toString().includes(searchTerm) ||
      request.carrierId.toString().includes(searchTerm) ||
      (request.notes && request.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <MainLayout title={t("transportationRequests")}>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">{t("transportationRequests")}</h1>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/transportation-requests/create">
                <Plus className="h-4 w-4 mr-2" />
                {t("create")}
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t("search")}
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="mb-6">
          <TabsList className="w-full justify-start border-b border-border mb-6">
            <TabsTrigger className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground" value="all">{t("all")}</TabsTrigger>
            <TabsTrigger className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground" value="pending">{t("pending")}</TabsTrigger>
            <TabsTrigger className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground" value="accepted">{t("accepted")}</TabsTrigger>
            <TabsTrigger className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground" value="rejected">{t("rejected")}</TabsTrigger>
            <TabsTrigger className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground" value="completed">{t("completed")}</TabsTrigger>
            <TabsTrigger className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground" value="cancelled">{t("cancelled")}</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <TransportationRequestList 
            transportationRequests={filteredRequests} 
            isStandalone={true} 
          />
        )}
      </div>
    </MainLayout>
  );
}
