import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Route, Vehicle } from "@shared/schema";

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

interface RouteFormProps {
  orderId: number;
  route?: Route;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function RouteForm({ orderId, route, onCancel, onSuccess }: RouteFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const isEditing = !!route;

  // Get available vehicles
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startPoint: route?.startPoint || "",
      endPoint: route?.endPoint || "",
      status: route?.status || "pending",
      vehicleId: route?.vehicleId || undefined,
      startDate: route?.startDate ? new Date(route.startDate) : undefined,
      orderId: orderId,
    },
  });

  const createRouteMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const formattedData = {
        ...data,
        startDate: data.startDate.toISOString(),
      };
      const res = await apiRequest("POST", "/api/routes", formattedData);
      if (!res.ok) {
        throw new Error(`Error creating route: ${res.status}`);
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t("route_added"),
        description: t("route_added_desc"),
      });
      queryClient.invalidateQueries({ queryKey: [`/api/orders/${orderId}/routes`] });
      onSuccess();
    },
    onError: (error: Error) => {
      console.error("Route creation error:", error);
      toast({
        title: t("route_add_error"),
        description: error.message || t("error"),
        variant: "destructive",
      });
    },
  });

  const updateRouteMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!route) throw new Error("No route to update");
      const formattedData = {
        ...data,
        startDate: data.startDate.toISOString(),
      };
      const res = await apiRequest("PATCH", `/api/routes/${route.id}`, formattedData);
      if (!res.ok) {
        throw new Error(`Error updating route: ${res.status}`);
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t("route_updated"),
        description: t("route_updated_desc"),
      });
      queryClient.invalidateQueries({ queryKey: [`/api/orders/${orderId}/routes`] });
      onSuccess();
    },
    onError: (error: Error) => {
      console.error("Route update error:", error);
      toast({
        title: t("route_update_error"),
        description: error.message || t("error"),
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormValues) {
    if (isEditing) {
      updateRouteMutation.mutate(data);
    } else {
      createRouteMutation.mutate(data);
    }
  }

  const isLoading = createRouteMutation.isPending || updateRouteMutation.isPending || vehiclesLoading;

  return (
    <Card className="border border-border">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {isEditing ? t("edit_route") : t("add_route")}
          </h3>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
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
                          <SelectValue placeholder={t("selectStatus")} />
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
                onClick={onCancel}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? t("saving") : t("adding")}
                  </>
                ) : (
                  isEditing ? t("save") : t("add")
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
