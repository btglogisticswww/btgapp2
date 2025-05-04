import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/hooks/use-language';
import { useToast } from '@/hooks/use-toast';
import { Carrier, TransportationRequest, insertTransportationRequestSchema } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest, queryClient } from '@/lib/queryClient';

type TransportationRequestFormProps = {
  orderId: number;
  requestId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function TransportationRequestForm({
  orderId,
  requestId,
  onSuccess,
  onCancel,
}: TransportationRequestFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoadingRequest, setIsLoadingRequest] = useState(false);

  // Fetch all carriers for the dropdown
  const { data: carriers, isLoading: isLoadingCarriers } = useQuery<Carrier[]>({
    queryKey: ['/api/carriers'],
    queryFn: async () => {
      const response = await fetch(`/api/carriers`);
      if (!response.ok) {
        throw new Error('Failed to fetch carriers');
      }
      return response.json();
    },
  });

  // If editing, fetch the current request data
  const { data: requestData, isLoading: isLoadingInitialData } = useQuery<TransportationRequest>({
    queryKey: ['/api/transportation-requests', requestId],
    queryFn: async () => {
      setIsLoadingRequest(true);
      try {
        const response = await fetch(`/api/transportation-requests/${requestId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transportation request');
        }
        return response.json();
      } finally {
        setIsLoadingRequest(false);
      }
    },
    enabled: !!requestId,
  });

  // Form schema
  const formSchema = z.object({
    orderId: z.number(),
    carrierId: z.number(),
    carrierName: z.string().optional(),
    transportationType: z.string().min(1, { message: t('Field is required') }),
    scheduledDate: z.string().min(1, { message: t('Field is required') }),
    offeredPrice: z.string().min(1, { message: t('Field is required') }),
    specialRequirements: z.string().optional(),
    status: z.string().default('pending_approval'),
  });

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId: orderId,
      carrierId: 0,
      carrierName: '',
      transportationType: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      offeredPrice: '',
      specialRequirements: '',
      status: 'pending_approval',
    },
  });

  // Set form values when editing
  useEffect(() => {
    if (requestData) {
      form.reset({
        orderId: requestData.orderId,
        carrierId: requestData.carrierId,
        carrierName: requestData.carrierName,
        transportationType: requestData.transportationType,
        scheduledDate: new Date(requestData.scheduledDate).toISOString().split('T')[0],
        offeredPrice: requestData.offeredPrice.toString(),
        specialRequirements: requestData.specialRequirements || '',
        status: requestData.status,
      });
    }
  }, [requestData, form]);

  // Mutations for creating/updating requests
  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      // Find the selected carrier's name
      const selectedCarrier = carriers?.find(carrier => carrier.id === data.carrierId);
      if (selectedCarrier) {
        data.carrierName = selectedCarrier.name;
      }

      // Convert offeredPrice to number
      const formattedData = {
        ...data,
        offeredPrice: parseFloat(data.offeredPrice)
      };

      const res = await apiRequest('POST', `/api/orders/${orderId}/transportation-requests`, formattedData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: t('Request Added'),
        description: t('Transportation request has been successfully added'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orders', orderId, 'transportation-requests'] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: t('Error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      // Find the selected carrier's name
      const selectedCarrier = carriers?.find(carrier => carrier.id === data.carrierId);
      if (selectedCarrier) {
        data.carrierName = selectedCarrier.name;
      }

      // Convert offeredPrice to number
      const formattedData = {
        ...data,
        offeredPrice: parseFloat(data.offeredPrice)
      };

      const res = await apiRequest('PATCH', `/api/transportation-requests/${requestId}`, formattedData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: t('Request Updated'),
        description: t('Transportation request has been successfully updated'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orders', orderId, 'transportation-requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transportation-requests', requestId] });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: t('Error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  function onSubmit(data: z.infer<typeof formSchema>) {
    if (requestId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  }

  // Loading state
  const isLoading = isLoadingCarriers || isLoadingRequest || isLoadingInitialData;
  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {requestId ? t('editTransportationRequest') : t('addTransportationRequest')}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="carrierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('selectCarrier')}</FormLabel>
                      <Select
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

                <FormField
                  control={form.control}
                  name="transportationType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('transportationType')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('transportationType')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="scheduledDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('scheduledDate')}</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="offeredPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('offeredPrice')}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('specialRequirements')}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t('specialRequirements')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {requestId && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('requestStatus')}</FormLabel>
                        <Select
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
                )}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isPending}
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              disabled={isLoading || isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {requestId ? t('update') : t('save')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
