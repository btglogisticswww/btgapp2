import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/use-language";
import { Plus, Loader2 } from "lucide-react";
import TransportationRequestCard from "./transportation-request-card";
import TransportationRequestForm from "./transportation-request-form";

type TransportationRequestListProps = {
  orderId: number;
};

export default function TransportationRequestList({ orderId }: TransportationRequestListProps) {
  const { t } = useLanguage();
  const [isAdding, setIsAdding] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch transportation requests for the order
  const {
    data: requests = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["/api/orders", orderId, "transportation-requests"],
  });

  // Filter requests based on active tab
  const filteredRequests = requests.filter((request: any) => {
    if (activeTab === "all") return true;
    return request.status === activeTab;
  });

  // Handle adding a new request
  const handleAddRequest = () => {
    setIsAdding(true);
    setEditingRequestId(null);
  };

  // Handle editing a request
  const handleEditRequest = (requestId: number) => {
    setEditingRequestId(requestId);
    setIsAdding(false);
  };

  // Handle form completion
  const handleFormSuccess = () => {
    setIsAdding(false);
    setEditingRequestId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-600">
        <p>{t("errorLoadingRequests")}</p>
        <p className="text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{t("transportationRequests")}</h2>
        {!isAdding && !editingRequestId && (
          <Button onClick={handleAddRequest}>
            <Plus className="h-4 w-4 mr-2" />
            {t("addRequest")}
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="mb-6">
          <TransportationRequestForm
            orderId={orderId}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      {editingRequestId && (
        <div className="mb-6">
          <TransportationRequestForm
            orderId={orderId}
            requestId={editingRequestId}
            onSuccess={handleFormSuccess}
          />
        </div>
      )}

      {requests.length > 0 ? (
        <div>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">{t("allRequests")}</TabsTrigger>
              <TabsTrigger value="pending">{t("pending")}</TabsTrigger>
              <TabsTrigger value="accepted">{t("accepted")}</TabsTrigger>
              <TabsTrigger value="rejected">{t("rejected")}</TabsTrigger>
              <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
              <TabsTrigger value="cancelled">{t("cancelled")}</TabsTrigger>
            </TabsList>
            <TabsContent value={activeTab} className="mt-0">
              <div className="space-y-2">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request: any) => (
                    <TransportationRequestCard
                      key={request.id}
                      request={request}
                      onEdit={() => handleEditRequest(request.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {t("noRequestsFound")}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          {t("noTransportationRequests")}
        </div>
      )}
    </div>
  );
}