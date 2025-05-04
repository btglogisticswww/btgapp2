import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { transportationRequestValidationSchema, Carrier } from '@shared/schema';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type TransportationRequestFormProps = {
  orderId: number;
  requestId?: number;
  onSuccess: () => void;
  onCancel: () => void;
};

const formSchema = z.object({
  orderId: z.number(),
  carrierId: z.number(),
  carrierName: z.string().optional(),
  transportationType: z.string().min(3, 'Minimium 3 characters'),
  offeredPrice: z.coerce.number().positive('Price must be positive'),
  scheduledDate: z.date(),
  status: z.string(),
  specialRequirements: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function TransportationRequestForm({
  orderId,
  requestId,
  onSuccess,
  onCancel,
}: TransportationRequestFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  
  // Form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId,
      carrierId: 0,
      transportationType: '',
      offeredPrice: 0,
      scheduledDate: new Date(),
      status: 'pending_approval',
      specialRequirements: '',
    },
  });

  // Fetch carriers for dropdown
  const { data: carriers, isLoading: isLoadingCarriers } = useQuery<Carrier[]>({
    queryKey: ['/api/carriers'],
    queryFn: async () => {
      const response = await fetch('/api/carriers');
      if (!response.ok) {
        throw new Error('Failed to fetch carriers');
      }
      return response.json();
    },
  });

  // Fetch request if we're editing
  const { data: requestData, isLoading: isLoadingRequest } = useQuery({
    queryKey: ['/api/transportation-requests', requestId],
    queryFn: async () => {
      if (!requestId) return null;
      const response = await fetch(`/api/transportation-requests/${requestId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transportation request');
      }
      return response.json();
    },
    enabled: !!requestId,
  });

  // Update form values when editing an existing request
  useEffect(() => {
    if (requestData) {
      form.reset({
        orderId: requestData.orderId || orderId,
        carrierId: requestData.carrierId,
        carrierName: requestData.carrierName,
        transportationType: requestData.transportationType,
        offeredPrice: Number(requestData.offeredPrice),
        scheduledDate: new Date(requestData.scheduledDate),
        status: requestData.status,
        specialRequirements: requestData.specialRequirements || '',
      });
    }
  }, [requestData, form, orderId]);

  // Create mutation for submitting new transportation request
  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const endpoint = requestId
        ? `/api/transportation-requests/${requestId}`
        : `/api/orders/${orderId}/transportation-requests`;
      const method = requestId ? 'PATCH' : 'POST';
      
      // Get carrier name if available
      if (carriers) {
        const selectedCarrier = carriers.find(c => c.id === data.carrierId);
        if (selectedCarrier) {
          data.carrierName = selectedCarrier.name;
        }
      }

      const response = await apiRequest(method, endpoint, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders', orderId, 'transportation-requests'] });
      toast({
        title: requestId ? t('transportation_request_updated') : t('transportation_request_created'),
        description: requestId ? t('transportation_request_updated_desc') : t('transportation_request_created_desc'),
      });
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Submit form
  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data);
  };

  // Check if loading
  const isLoading = isLoadingCarriers || isLoadingRequest || createMutation.isPending;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {requestId ? t('editTransportationRequest') : t('addTransportationRequest')}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* Carrier Selection */}
            <FormField
              control={form.control}
              name="carrierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('selectCarrier')}</FormLabel>
                  <Select
                    disabled={isLoading}
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectCarrier')} />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transportation Type */}
            <FormField
              control={form.control}
              name="transportationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('transportationType')}</FormLabel>
                  <FormControl>
                    <Input disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Scheduled Date */}
            <FormField
              control={form.control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t('scheduledDate')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ru })
                          ) : (
                            <span>{t('selectDate')}</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={isLoading}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Offered Price */}
            <FormField
              control={form.control}
              name="offeredPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('offeredPrice')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={isLoading}
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
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
                  <FormLabel>{t('requestStatus')}</FormLabel>
                  <Select
                    disabled={isLoading}
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('select_status')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending_approval">{t('pending_approval')}</SelectItem>
                      <SelectItem value="accepted">{t('accepted')}</SelectItem>
                      <SelectItem value="rejected">{t('rejected')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Special Requirements */}
            <FormField
              control={form.control}
              name="specialRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('specialRequirements')}</FormLabel>
                  <FormControl>
                    <Textarea disabled={isLoading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('loading')}
                </>
              ) : (
                t('save')
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
