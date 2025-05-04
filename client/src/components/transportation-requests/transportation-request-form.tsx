import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Order, Carrier, TransportationRequest, transportationRequestValidationSchema } from "@shared/schema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Save } from "lucide-react";
import { formatDate } from "@/lib/formatters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  orderId: z.number().positive(),
  carrierId: z.number().positive(),
  price: z.coerce.number().positive(),
  deadline: z.string().min(1, { message: "Deadline is required" }),
  status: z.string(),
  notes: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface TransportationRequestFormProps {
  transportationRequest?: TransportationRequest;
  preselectedOrderId?: number;
}

export function TransportationRequestForm({
  transportationRequest,
  preselectedOrderId,
}: TransportationRequestFormProps) {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    transportationRequest?.deadline ? new Date(transportationRequest.deadline) : undefined
  );

  // Fetch Orders
  const { data: orders, isLoading: isLoadingOrders } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Fetch Carriers
  const { data: carriers, isLoading: isLoadingCarriers } = useQuery<Carrier[]>({
    queryKey: ["/api/carriers"],
  });

  // Get default values
  const defaultValues = transportationRequest
    ? {
        orderId: transportationRequest.orderId,
        carrierId: transportationRequest.carrierId,
        price: transportationRequest.price,
        deadline: transportationRequest.deadline,
        status: transportationRequest.status,
        notes: transportationRequest.notes,
      }
    : {
        orderId: preselectedOrderId || 0,
        carrierId: 0,
        price: 0,
        deadline: "",
        status: "pending",
        notes: "",
      };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Update form when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      form.setValue("deadline", format(selectedDate, "yyyy-MM-dd"));
    }
  }, [selectedDate, form]);

  // Update form when transportationRequest changes
  useEffect(() => {
    if (transportationRequest) {
      form.reset({
        orderId: transportationRequest.orderId,
        carrierId: transportationRequest.carrierId,
        price: transportationRequest.price,
        deadline: transportationRequest.deadline,
        status: transportationRequest.status,
        notes: transportationRequest.notes,
      });
      if (transportationRequest.deadline) {
        setSelectedDate(new Date(transportationRequest.deadline));
      }
    }
  }, [transportationRequest, form]);

  // Update form when preselectedOrderId changes
  useEffect(() => {
    if (preselectedOrderId && form.getValues().orderId === 0) {
      form.setValue("orderId", preselectedOrderId);
    }
  }, [preselectedOrderId, form]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      const response = await apiRequest(
        "POST",
        "/api/transportation-requests",
        formData
      );
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transportation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: t("success"),
        description: t("transportationRequestCreated"),
      });
      setLocation("/transportation-requests");
    },
    onError: (error: Error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: FormValues) => {
      if (!transportationRequest) throw new Error("No transportation request to update");
      const response = await apiRequest(
        "PATCH",
        `/api/transportation-requests/${transportationRequest.id}`,
        formData
      );
      return await response.json();
    },
    onSuccess: () => {
      if (!transportationRequest) return;
      queryClient.invalidateQueries({ queryKey: ["/api/transportation-requests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transportation-requests", transportationRequest.id] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", transportationRequest.orderId, "transportation-requests"] });
      toast({
        title: t("success"),
        description: t("transportationRequestUpdated"),
      });
      setLocation(`/transportation-requests/${transportationRequest.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: FormValues) => {
    if (transportationRequest) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isLoading = isLoadingOrders || isLoadingCarriers;

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => {
          if (transportationRequest) {
            setLocation(`/transportation-requests/${transportationRequest.id}`);
          } else if (preselectedOrderId) {
            setLocation(`/orders/${preselectedOrderId}?tab=transportation`);
          } else {
            setLocation("/transportation-requests");
          }
        }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back")}
      </Button>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Order selection */}
                  <FormField
                    control={form.control}
                    name="orderId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("order")}</FormLabel>
                        <Select
                          disabled={!!preselectedOrderId || !!transportationRequest}
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectOrder")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {orders?.map((order) => (
                              <SelectItem key={order.id} value={order.id.toString()}>
                                #{order.id} - {order.orderNumber}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t("orderDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Carrier selection */}
                  <FormField
                    control={form.control}
                    name="carrierId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("carrier")}</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectCarrier")} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {carriers?.map((carrier) => (
                              <SelectItem key={carrier.id} value={carrier.id.toString()}>
                                {carrier.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t("carrierDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price */}
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
                            placeholder="0.00"
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value === "" ? "0" : e.target.value;
                              field.onChange(value);
                            }} 
                          />
                        </FormControl>
                        <FormDescription>
                          {t("priceDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Deadline */}
                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("deadline")}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  formatDate(field.value)
                                ) : (
                                  <span>{t("pickDate")}</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          {t("deadlineDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("status")}</FormLabel>
                        <Select
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
                        <FormDescription>
                          {t("statusDescription")}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Notes - spans full width */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("notes")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t("notesPlaceholder")}
                          className="resize-none min-h-[120px]"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("notesDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && (
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    )}
                    <Save className="mr-2 h-4 w-4" />
                    {transportationRequest ? t("update") : t("create")}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
