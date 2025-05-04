import { useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Order, Client, Carrier, Route } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

// Define a schema for the form
const formSchema = z.object({
  orderNumber: z.string().min(3, { message: 'Order number must be at least 3 characters' }),
  clientId: z.number().int().positive(),
  type: z.string().min(2, { message: 'Type must be at least 2 characters' }),
  status: z.string(),
  orderDate: z.string(),
  deliveryDate: z.string().optional().nullable(),
  price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
  cost: z.coerce.number().min(0, { message: 'Cost must be a positive number' }).optional().nullable(),
  weight: z.coerce.number().min(0, { message: 'Weight must be a positive number' }).optional().nullable(),
  volume: z.coerce.number().min(0, { message: 'Volume must be a positive number' }).optional().nullable(),
  originAddress: z.string().min(3, { message: 'Origin address is required' }),
  destinationAddress: z.string().min(3, { message: 'Destination address is required' }),
  route: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  managerId: z.number().int().positive().optional().nullable(),
});

export type OrderFormData = z.infer<typeof formSchema>;

interface OrderFormProps {
  initialData?: Order;
  onSubmit: (data: OrderFormData) => void;
  isSubmitting: boolean;
}

export function OrderForm({ initialData, onSubmit, isSubmitting }: OrderFormProps) {
  const { t } = useLanguage();
  
  // Fetch clients
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const form = useForm<OrderFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: initialData?.orderNumber || '',
      clientId: initialData?.clientId || 0,
      type: initialData?.type || '',
      status: initialData?.status || 'pending',
      orderDate: initialData?.orderDate ? new Date(initialData.orderDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      deliveryDate: initialData?.deliveryDate ? new Date(initialData.deliveryDate).toISOString().split('T')[0] : null,
      price: initialData?.price || 0,
      cost: initialData?.cost || null,
      weight: initialData?.weight || null,
      volume: initialData?.volume || null,
      originAddress: initialData?.originAddress || '',
      destinationAddress: initialData?.destinationAddress || '',
      route: initialData?.route || '',
      notes: initialData?.notes || '',
      managerId: initialData?.managerId || null,
    }
  });

  const handleSubmit: SubmitHandler<OrderFormData> = (data) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">{t('generalInfo')}</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="orderNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('id')}</FormLabel>
                      <FormControl>
                        <Input placeholder="ORD-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="clientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('client')}</FormLabel>
                      <Select 
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('client')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id.toString()}>
                              {client.name}
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
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('type')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('type')} {...field} />
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
                      <FormLabel>{t('status')}</FormLabel>
                      <Select 
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('status')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">{t('active')}</SelectItem>
                          <SelectItem value="pending">{t('pending')}</SelectItem>
                          <SelectItem value="completed">{t('completed')}</SelectItem>
                          <SelectItem value="cancelled">{t('cancelled')}</SelectItem>
                          <SelectItem value="in_transit">{t('in_transit')}</SelectItem>
                          <SelectItem value="preparing">{t('preparing')}</SelectItem>
                          <SelectItem value="waiting">{t('waiting')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="orderDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('date')}</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('endDate')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value || null)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">{t('cargoInfo')}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('weight')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value === null ? '' : field.value}
                            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('volume')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value === null ? '' : field.value}
                            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('price')}</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('cost')}</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            value={field.value === null ? '' : field.value}
                            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">{t('route')}</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="originAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('origin')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('origin')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destinationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('destination')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('destination')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="route"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('route')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('route')} 
                          {...field} 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">{t('additionalInfo')}</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="managerId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('manager')}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
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
                      <FormLabel>{t('notes')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t('notes')} 
                          className="min-h-[100px]" 
                          {...field} 
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value || null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('saving')}
              </>
            ) : initialData ? t('update') : t('create')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
