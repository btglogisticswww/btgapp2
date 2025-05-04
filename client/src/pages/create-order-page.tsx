import { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { useLanguage } from "@/hooks/use-language";
import { OrderForm, OrderFormData } from "@/components/orders/order-form";
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function CreateOrderPage() {
  const { t } = useLanguage();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  
  const createOrderMutation = useMutation({
    mutationFn: async (data: OrderFormData) => {
      const res = await apiRequest('POST', '/api/orders', data);
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: t('order_created'),
        description: t('order_created_desc'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      // Navigate to the order detail page
      setLocation(`/orders/${data.id}`);
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
    createOrderMutation.mutate(data);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('newOrder')}</CardTitle>
            <CardDescription>{t('create_order_desc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <OrderForm 
              onSubmit={handleSubmit} 
              isSubmitting={createOrderMutation.isPending} 
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
