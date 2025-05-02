import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Carrier, carrierValidationSchema, InsertCarrier } from "@shared/schema";
import { z } from "zod";

interface CarrierDialogProps {
  open: boolean;
  carrier: Carrier | null;
  onClose: (refreshNeeded?: boolean) => void;
}

// Расширяем схему валидации для нашей формы на основе существующей схемы
const formSchema = carrierValidationSchema.extend({
  contactPerson: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  vehicleType: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal(""))
});

type CarrierFormValues = z.infer<typeof formSchema>;

export function CarrierDialog({ open, carrier, onClose }: CarrierDialogProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CarrierFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: carrier?.name || "",
      contactPerson: carrier?.contactPerson || "",
      phone: carrier?.phone || "",
      email: carrier?.email || "",
      address: carrier?.address || "",
      vehicleType: carrier?.vehicleType || "",
      notes: carrier?.notes || "",
    },
  });

  const createCarrierMutation = useMutation({
    mutationFn: async (newCarrier: InsertCarrier) => {
      const res = await apiRequest("POST", "/api/carriers", newCarrier);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carriers"] });
      setIsSubmitting(false);
      form.reset();
      onClose(true);
    },
    onError: (error: Error) => {
      console.error("Error creating carrier:", error);
      setIsSubmitting(false);
    },
  });

  const updateCarrierMutation = useMutation({
    mutationFn: async (updatedCarrier: Partial<Carrier>) => {
      const res = await apiRequest(
        "PATCH",
        `/api/carriers/${carrier?.id}`,
        updatedCarrier
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/carriers"] });
      setIsSubmitting(false);
      form.reset();
      onClose(true);
    },
    onError: (error: Error) => {
      console.error("Error updating carrier:", error);
      setIsSubmitting(false);
    },
  });

  function onSubmit(values: CarrierFormValues) {
    setIsSubmitting(true);
    
    if (carrier) {
      updateCarrierMutation.mutate({
        ...values,
        id: carrier.id,
      });
    } else {
      createCarrierMutation.mutate(values as InsertCarrier);
    }
  }

  function handleDialogClose() {
    form.reset();
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {carrier ? t("edit_carrier") : t("add_new_carrier")}
          </DialogTitle>
          <DialogDescription>
            {carrier ? t("edit_carrier_desc") : t("add_carrier_desc")}
          </DialogDescription>
        </DialogHeader>

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

            <div className="grid grid-cols-2 gap-4">
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
                      disabled={isSubmitting}
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={handleDialogClose}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("saving") : carrier ? t("update") : t("create")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
