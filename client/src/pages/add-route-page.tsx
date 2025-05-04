import { FormEvent, useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Vehicle } from "@shared/schema";

const formSchema = z.object({
  startPoint: z.string().min(2, { message: "Start point must be at least 2 characters." }),
  endPoint: z.string().min(2, { message: "End point must be at least 2 characters." }),
  status: z.string({
    required_error: "Please select a status.",
  }),
  startDate: z.date({
    required_error: "Please select a date.",
  }),
  vehicleId: z.number({
    required_error: "Please select a vehicle.",
    invalid_type_error: "Vehicle ID must be a number.",
  }),
  orderId: z.number(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddRoutePage() {
  const { id } = useParams<{ id: string }>();
  const [_, navigate] = useLocation();
  const { t } = useLanguage();
  const { toast } = useToast();

  const orderId = parseInt(id);

  // Get order details to display in the header
  const { data: order, isLoading: orderLoading } = useQuery({ 
    queryKey: [`/api/orders/${orderId}`],
    enabled: !isNaN(orderId)
  });
  
  // Get available vehicles
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
    enabled: !isNaN(orderId)
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startPoint: "",
      endPoint: "",
      status: "pending",
      vehicleId: undefined,
      orderId: orderId,
    },
  });

  const routeMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      // Format the data before sending
      const formattedData = {
        ...data,
        startDate: data.startDate.toISOString(),
      };
      const res = await apiRequest("POST", "/api/routes", formattedData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: t("route_added"),
        description: t("route_added_desc"),
      });
      // Invalidate the query cache for routes
      queryClient.invalidateQueries({ queryKey: [`/api/orders/${orderId}/routes`] });
      // Navigate back to the order detail page
      navigate(`/orders/${orderId}`);
    },
    onError: (error) => {
      console.error("Route creation error:", error);
      toast({
        title: t("route_add_error"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormValues) {
    routeMutation.mutate(data);
  }

  if (orderLoading || vehiclesLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {t("add_route_to_order").replace("{{orderId}}", order?.orderNumber || id)}
              </h2>
              <p className="text-muted-foreground">
                {t("add_route")}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate(`/orders/${id}`)}>
              {t("back")}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("add_route")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startPoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("startPoint")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("enter_start_point")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endPoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("endPoint")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("enter_end_point")} {...field} />
                          </FormControl>
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
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("select_status")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="pending">{t("pending")}</SelectItem>
                              <SelectItem value="active">{t("active")}</SelectItem>
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
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t("startDate")}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t("select_date")}</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("select_vehicle")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {vehicles?.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                                  {vehicle.type} ({vehicle.regNumber})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/orders/${id}`)}
                    >
                      {t("cancel")}
                    </Button>
                    <Button
                      type="submit"
                      disabled={routeMutation.isPending}
                    >
                      {routeMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("saving")}
                        </>
                      ) : (
                        t("add")
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
