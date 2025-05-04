import { useLanguage } from "@/hooks/use-language";
import MainLayout from "@/components/layout/MainLayout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useParams } from "wouter";
import { Client, clientValidationSchema } from "@shared/schema";
import { Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

// Создаем схему валидации на основе схемы из shared/schema.ts
const formSchema = z.object({
  name: z.string().min(2, "error.name_min_length"),
  contactPerson: z.string().min(2, "error.contact_person_min_length"),
  phone: z.string().optional().nullable(),
  email: z.string().email("error.invalid_email").optional().nullable(),
  address: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

// Тип для данных формы
type FormData = z.infer<typeof formSchema>;

export default function EditClientPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const clientId = parseInt(params.id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Запрос данных клиента
  const { data: client, isLoading, error } = useQuery<Client>({
    queryKey: [`/api/clients/${clientId}`],
    enabled: !isNaN(clientId),
  });

  // Инициализируем форму с валидацией
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: client?.name || "",
      contactPerson: client?.contactPerson || "",
      phone: client?.phone || "",
      email: client?.email || "",
      address: client?.address || "",
      notes: client?.notes || "",
    },
    values: client ? {
      name: client.name,
      contactPerson: client.contactPerson,
      phone: client.phone || "",
      email: client.email || "",
      address: client.address || "",
      notes: client.notes || "",
    } : undefined,
  });

  // Мутация для обновления клиента
  const updateClientMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("PATCH", `/api/clients/${clientId}`, data);
      return response.json();
    },
    onSuccess: () => {
      // Инвалидируем кеш списка клиентов и данных текущего клиента
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      queryClient.invalidateQueries({ queryKey: [`/api/clients/${clientId}`] });
      
      // Показываем уведомление об успехе
      toast({
        title: t("client_updated"),
        description: t("client_updated_desc"),
      });
      
      // Перенаправляем на страницу клиентов
      navigate("/clients");
    },
    onError: (error: Error) => {
      // Показываем уведомление об ошибке
      toast({
        title: t("error"),
        description: error.message || t("client_update_error"),
        variant: "destructive",
      });
    },
  });

  // Обработчик отправки формы
  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    updateClientMutation.mutate(data);
    setIsSubmitting(false);
  };

  // Показываем состояние загрузки
  if (isLoading) {
    return (
      <MainLayout title={t("loading")}>
        <div className="container mx-auto py-6 flex justify-center items-center min-h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  // Показываем ошибку, если клиент не найден
  if (error || !client) {
    return (
      <MainLayout title={t("error")}>
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-destructive">
                {error ? (error as Error).message : t("client_not_found")}
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={t("edit_client")}>
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("edit_client")}</CardTitle>
            <CardDescription>{t("edit_client_desc")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("client_name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enter_client_name")}
                          {...field}
                          disabled={isSubmitting}
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
                          disabled={isSubmitting}
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
                            disabled={isSubmitting}
                            value={field.value || ""}
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
                            disabled={isSubmitting}
                            value={field.value || ""}
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
                          disabled={isSubmitting}
                          value={field.value || ""}
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
                          disabled={isSubmitting}
                          value={field.value || ""}
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
                    onClick={() => navigate("/clients")}
                    disabled={isSubmitting}
                  >
                    {t("cancel")}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? t("saving") : t("update")}
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
