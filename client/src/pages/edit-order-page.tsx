import { useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/hooks/use-language";
import { NewOrderForm, OrderFormData } from "@/components/orders/new-order-form";
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation, useParams } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Order } from '@shared/schema';
import { Loader2 } from 'lucide-react';

export default function EditOrderPage() {
  const { t } = useLanguage();
  const params = useParams<{ id: string }>();
  const orderId = params?.id ? parseInt(params.id) : null;
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Fetch the order data
  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !!orderId,
  });
  
  const updateOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      const res = await apiRequest('PUT', `/api/orders/${orderId}`, data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: t('order_updated'),
        description: t('order_updated_desc'),
      });
      queryClient.invalidateQueries({ queryKey: [`/api/orders/${orderId}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      // Navigate back to the order detail page
      setLocation(`/orders/${orderId}`);
    },
    onError: (error: Error) => {
      toast({
        title: t('error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (data: OrderFormData) => {
    updateOrderMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6 flex justify-center items-center min-h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error || !order) {
    return (
      <MainLayout>
        <div className="container mx-auto py-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-destructive">
                {error ? (error as Error).message : t('order_not_found')}
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('edit_order')}</CardTitle>
            <CardDescription>
              {t('edit_order_desc')} - {order.orderNumber}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NewOrderForm 
              initialData={order}
              onSubmit={handleSubmit} 
              isSubmitting={updateOrderMutation.isPending} 
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
