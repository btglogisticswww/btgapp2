import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";
import { formatDateTime } from "@/lib/utils";
import { Eye, Pencil, AlertTriangle, MoreHorizontal, Check, Truck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type TransportationRequestCardProps = {
  request: any;
  onEdit?: () => void;
};

export default function TransportationRequestCard({
  request,
  onEdit,
}: TransportationRequestCardProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch carrier data
  const { data: carrier } = useQuery({
    queryKey: ["/api/carriers", request.carrierId],
    enabled: !!request.carrierId,
  });

  // Fetch vehicle data if assigned
  const { data: vehicle } = useQuery({
    queryKey: ["/api/vehicles", request.vehicleId],
    enabled: !!request.vehicleId,
  });

  // Update request status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      setIsLoading(true);
      const res = await apiRequest("PATCH", `/api/transportation-requests/${id}`, { status });
      return await res.json();
    },
    onSuccess: () => {
      setIsLoading(false);
      toast({
        title: t("statusUpdated"),
        description: t("requestStatusUpdatedDesc"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transportation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", request.orderId, "transportation-requests"] });
    },
    onError: (error: Error) => {
      setIsLoading(false);
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update status handler
  const handleUpdateStatus = (status: string) => {
    updateStatusMutation.mutate({ id: request.id, status });
  };

  // Get status badge style based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">{t("pending")}</Badge>;
      case "accepted":
        return <Badge variant="secondary">{t("accepted")}</Badge>;
      case "rejected":
        return <Badge variant="destructive">{t("rejected")}</Badge>;
      case "completed":
        return <Badge variant="default" className="bg-green-600">{t("completed")}</Badge>;
      case "cancelled":
        return <Badge variant="destructive" className="bg-orange-600">{t("cancelled")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="border-none shadow-none rounded-none mb-4 last:mb-0 hover:bg-secondary/20">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">
                  {carrier ? carrier.name : t("unnamed")}
                </h3>
                {getStatusBadge(request.status)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" disabled={isLoading}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onEdit}>
                    <Pencil className="mr-2 h-4 w-4" />
                    {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>{t("changeStatus")}</DropdownMenuLabel>
                  {request.status !== "accepted" && (
                    <DropdownMenuItem onClick={() => handleUpdateStatus("accepted")}>
                      <Check className="mr-2 h-4 w-4" />
                      {t("markAsAccepted")}
                    </DropdownMenuItem>
                  )}
                  {request.status !== "rejected" && (
                    <DropdownMenuItem onClick={() => handleUpdateStatus("rejected")}>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      {t("markAsRejected")}
                    </DropdownMenuItem>
                  )}
                  {request.status !== "completed" && (
                    <DropdownMenuItem onClick={() => handleUpdateStatus("completed")}>
                      <Check className="mr-2 h-4 w-4" />
                      {t("markAsCompleted")}
                    </DropdownMenuItem>
                  )}
                  {request.status !== "cancelled" && (
                    <DropdownMenuItem onClick={() => handleUpdateStatus("cancelled")}>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      {t("markAsCancelled")}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
              {vehicle && (
                <div className="flex items-center gap-1">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {vehicle.regNumber} - {vehicle.type}
                  </span>
                </div>
              )}
              {request.price && (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {t("price")}:
                  </span>
                  <span className="text-sm">
                    {request.price.toLocaleString()} ₽
                  </span>
                </div>
              )}
              {request.deadline && (
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">
                    {t("deadline")}:
                  </span>
                  <span className="text-sm">
                    {formatDateTime(request.deadline, "date")}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-2 text-xs text-muted-foreground">
              {t("createdAt")}: {formatDateTime(request.createdAt)}
              {request.updatedAt && request.updatedAt !== request.createdAt && ` • ${t("updatedAt")}: ${formatDateTime(request.updatedAt)}`}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}