import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transportationRequestValidationSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { Loader2 } from "lucide-react";

type TransportationRequestFormProps = {
  orderId?: number;
  requestId?: number;
  onSuccess?: () => void;
};

export default function TransportationRequestForm({
  orderId,
  requestId,
  onSuccess,
}: TransportationRequestFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch the request if editing
  const { data: request, isLoading: isLoadingRequest } = useQuery({
    queryKey: ['/api/transportation-requests', requestId],
    enabled: !!requestId,
  });

  // Fetch available carriers
  const { data: carriers = [], isLoading: isLoadingCarriers } = useQuery({
    queryKey: ['/api/carriers'],
  });

  // Fetch available vehicles
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['/api/vehicles'],
  });

  const form = useForm({
    resolver: zodResolver(transportationRequestValidationSchema),
    defaultValues: {
      orderId: orderId || 0,
      carrierId: 0,
      status: "pending",
      vehicleId: null,
      price: 0,
      deadline: "",
    },
  });

  // Update form values when editing existing request
  useEffect(() => {
    if (request && !isLoadingRequest) {
      const { status, carrierId, vehicleId, price, deadline } = request;
      
      form.reset({
        orderId: orderId || request.orderId,
        carrierId,
        status,
        vehicleId: vehicleId || null,
        price: price || 0,
        deadline: deadline ? new Date(deadline).toISOString().split('T')[0] : "",
      });
    }
  }, [request, isLoadingRequest, form, orderId]);

  // Create or update transportation request
  const mutation = useMutation({
    mutationFn: async (data: any) => {
      setIsLoading(true);
      const formattedData = {
        ...data,
        orderId: parseInt(String(data.orderId)),
        carrierId: parseInt(String(data.carrierId)),
        vehicleId: data.vehicleId ? parseInt(String(data.vehicleId)) : null,
        price: data.price ? parseFloat(String(data.price)) : null,
      };

      if (requestId) {
        // Update existing request
        const res = await apiRequest("PUT", `/api/transportation-requests/${requestId}`, formattedData);
        return await res.json();
      } else {
        // Create new request
        const res = await apiRequest("POST", "/api/transportation-requests", formattedData);
        return await res.json();
      }
    },
    onSuccess: () => {
      setIsLoading(false);
      toast({
        title: requestId ? t("requestUpdated") : t("requestCreated"),
        description: requestId ? t("requestUpdatedDesc") : t("requestCreatedDesc"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/transportation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      if (orderId) {
        queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId, "transportation-requests"] });
      }
      if (onSuccess) onSuccess();
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

  const onSubmit = form.handleSubmit((data) => {
    mutation.mutate(data);
  });

  if (isLoadingRequest && requestId) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle>
          {requestId ? t("editTransportationRequest") : t("addTransportationRequest")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="carrierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("carrier")}</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={String(field.value) || "0"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectCarrier")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCarriers ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        carriers.map((carrier: any) => (
                          <SelectItem key={carrier.id} value={String(carrier.id)}>
                            {carrier.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("status")}</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">{t("pending")}</SelectItem>
                      <SelectItem value="accepted">{t("accepted")}</SelectItem>
                      <SelectItem value="rejected">{t("rejected")}</SelectItem>
                      <SelectItem value="completed">{t("completed")}</SelectItem>
                      <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("vehicle")}</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={(value) => field.onChange(value ? parseInt(value) : null)}
                    value={field.value ? String(field.value) : ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("selectVehicle")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">{t("noVehicle")}</SelectItem>
                      {isLoadingVehicles ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        vehicles
                          .filter((vehicle: any) => {
                            const selectedCarrierId = form.getValues('carrierId');
                            return !selectedCarrierId || vehicle.carrierId === selectedCarrierId;
                          })
                          .map((vehicle: any) => (
                            <SelectItem key={vehicle.id} value={String(vehicle.id)}>
                              {vehicle.regNumber} - {vehicle.type}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("price")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value === "" ? "0" : e.target.value;
                        field.onChange(parseFloat(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("deadline")}</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 mt-6">
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSuccess) onSuccess();
                }}
                disabled={isLoading}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {requestId ? t("update") : t("create")}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}