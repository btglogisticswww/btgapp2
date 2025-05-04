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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t("search")}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t("filter_by_status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all_statuses")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="accepted">{t("accepted")}</SelectItem>
              <SelectItem value="rejected">{t("rejected")}</SelectItem>
              <SelectItem value="completed">{t("completed")}</SelectItem>
              <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
