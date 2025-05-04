import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { useLocation, useParams } from "wouter";
import MainLayout from "@/components/layout/MainLayout";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  contactPerson: z.string().min(1, { message: "Contact person is required" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  email: z.string().email({ message: "Invalid email format" }),
  address: z.string().min(1, { message: "Address is required" }),
  vehicleType: z.string().min(1, { message: "Vehicle type is required" }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCarrierPage() {
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const carrierId = parseInt(params.id, 10);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      vehicleType: "",
      notes: "",
    },
  });

  const { data: carrier, isLoading } = useQuery({
    queryKey: [`/api/carriers/${carrierId}`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/carriers/${carrierId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch carrier");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (carrier) {
      form.reset({
        name: carrier.name,
        contactPerson: carrier.contactPerson,
        phone: carrier.phone,
        email: carrier.email,
        address: carrier.address,
        vehicleType: carrier.vehicleType,
        notes: carrier.notes || "",
      });
    }
  }, [carrier, form]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: FormValues) => {
      const response = await apiRequest("PATCH", `/api/carriers/${carrierId}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("carrier_updated"),
        description: t("carrier_updated_desc"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/carriers"] });
      queryClient.invalidateQueries({ queryKey: [`/api/carriers/${carrierId}`] });
      navigate("/carriers");
    },
    onError: (error) => {
      toast({
        title: t("error"),
        description: error.message || t("carrier_update_error"),
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: FormValues) {
    mutate(data);
  }

  if (isLoading) {
    return (
      <MainLayout title={t("edit_carrier")}>
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t("edit_carrier")}>
      <div className="p-6">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>{t("edit_carrier")}</CardTitle>
            <CardDescription>{t("edit_carrier_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("carrier_name")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enter_carrier_name")}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPerson"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contact_person")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enter_contact_person")}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enter_phone")}
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t("enter_email")}
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enter_address")}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("vehicle_type")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enter_vehicle_type")}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("notes")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("enter_notes")}
                      className="resize-none"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/carriers")}
                disabled={isPending}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? t("saving") : t("update")}
              </Button>
            </div>
          </form>
        </Form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
