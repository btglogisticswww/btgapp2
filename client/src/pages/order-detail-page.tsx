'use client';
import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { Order, Client, Route, Carrier, Vehicle } from "@shared/schema";
import { formatCurrency, formatDate, getStatusColors } from "@/lib/utils";
import { 
  Loader2,
  ArrowLeft,
  Truck,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  User,
  Info,
  FileText,
  MapIcon,
  Phone,
  Mail,
  MessageCircle,
  FileEdit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";

export default function OrderDetailPage() {
  const { t } = useLanguage();
  const [, params] = useRoute('/orders/:id');
  const orderId = params?.id ? parseInt(params.id) : 0;

  // Fetch order data
  const { data: order, isLoading: orderLoading } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      return response.json();
    },
    enabled: !!orderId,
  });

  // Fetch client data
  const { data: client, isLoading: clientLoading } = useQuery<Client>({
    queryKey: ["/api/clients", order?.clientId],
    queryFn: async () => {
      if (!order?.clientId) throw new Error('No client ID');
      const response = await fetch(`/api/clients/${order.clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch client');
      }
      return response.json();
    },
    enabled: !!order?.clientId,
  });

  // Fetch routes for this order
  const { data: routes, isLoading: routesLoading } = useQuery<Route[]>({
    queryKey: ["/api/orders", orderId, "routes"],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}/routes`);
      if (!response.ok) {
        throw new Error("Failed to fetch routes");
      }
      return await response.json();
    },
    enabled: !!orderId,
  });

  // Fetch carrier
  const { data: carrier, isLoading: carrierLoading } = useQuery<Carrier>({
    queryKey: ["/api/carriers", order?.carrierId],
    queryFn: async () => {
      if (!order?.carrierId) throw new Error('No carrier ID');
      const response = await fetch(`/api/carriers/${order.carrierId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch carrier');
      }
      return response.json();
    },
    enabled: !!order?.carrierId,
  });

  // Fetch all carriers for the order's routes
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [carriersLoading, setCarriersLoading] = useState(false);

  useEffect(() => {
    const fetchCarriersForVehicles = async () => {
      if (!routes?.length) return;
      
      setCarriersLoading(true);
      try {
        const vehicleIds = routes.map(route => route.vehicleId).filter(Boolean);
        
        if (vehicleIds.length === 0) {
          setCarriersLoading(false);
          return;
        }

        // First get vehicles
        const vehiclesPromises = vehicleIds.map(id => 
          fetch(`/api/vehicles/${id}`).then(res => res.json())
        );
        
        const vehicles = await Promise.all(vehiclesPromises);
        
        // Then get carriers for these vehicles
        const carrierIds = vehicles.map(vehicle => vehicle.carrierId).filter(Boolean);
        const uniqueCarrierIds = Array.from(new Set(carrierIds));
        
        if (uniqueCarrierIds.length === 0) {
          setCarriersLoading(false);
          return;
        }
        
        const carriersPromises = uniqueCarrierIds.map(id => 
          fetch(`/api/carriers/${id}`).then(res => res.json())
        );
        
        const fetchedCarriers = await Promise.all(carriersPromises);
        setCarriers(fetchedCarriers);
      } catch (error) {
        console.error('Error fetching carriers for vehicles:', error);
      } finally {
        setCarriersLoading(false);
      }
    };

    fetchCarriersForVehicles();
  }, [routes]);

  // Add the main carrier if not already in the list
  useEffect(() => {
    if (carrier && !carriers.find(c => c.id === carrier.id)) {
      setCarriers(prev => [...prev, carrier]);
    }
  }, [carrier, carriers]);

  const isLoading = orderLoading || clientLoading || routesLoading || carrierLoading || carriersLoading;

  if (isLoading) {
    return (
      <MainLayout title={t('orderDetails')}>
        <div className="flex items-center justify-center min-h-[70vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout title={t('orderDetails')}>
        <div className="p-6">
          <Link href="/orders">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back')}
            </Button>
          </Link>
          <Card>
            <CardContent className="p-6 text-center">
              <p>{t('noData')}</p>
              <p>{t('Order not found')}</p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const { status } = order;
  const statusColors = getStatusColors(status);

  return (
    <MainLayout title={t('orderDetails')}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/orders">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('back')}
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">{t('orderDetails')}</h1>
            <Badge className={`${statusColors.bg} ${statusColors.text}`}>
              {t(status)}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <FileEdit className="mr-2 h-4 w-4" />
              {t('edit')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t('generalInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('id')}:</span>
                  <span>{order.orderNumber}</span>
                </div>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('client')}:</span>
                  <span>{client?.name || '-'}</span>
                </div>
                <div className="flex items-center">
                  <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('type')}:</span>
                  <span>{order.type}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('orderDate')}:</span>
                  <span>{formatDate(order.orderDate)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('deliveryDate')}:</span>
                  <span>{order.deliveryDate ? formatDate(order.deliveryDate) : '-'}</span>
                </div>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('manager')}:</span>
                  <span>{order.managerId ? `ID: ${order.managerId}` : '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t('cargoInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('origin')}:</span>
                  <span>{order.originAddress}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('destination')}:</span>
                  <span>{order.destinationAddress}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('route')}:</span>
                  <span>{order.route}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('weight')}:</span>
                  <span>{order.weight || '-'}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('volume')}:</span>
                  <span>{order.volume || '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{t('financialInfo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('price')}:</span>
                  <span>{order.price ? formatCurrency(Number(order.price)) : '-'}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-muted-foreground mr-1">{t('cost')}:</span>
                  <span>{order.cost ? formatCurrency(Number(order.cost)) : '-'}</span>
                </div>
                {order.notes && (
                  <div className="flex items-start pt-2">
                    <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground block">{t('notes')}:</span>
                      <p className="text-sm mt-1">{order.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="client" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="client">{t('client')}</TabsTrigger>
            <TabsTrigger value="routes">{t('routes')}</TabsTrigger>
            <TabsTrigger value="carriers">{t('carriers')}</TabsTrigger>
          </TabsList>

          <TabsContent value="client" className="mt-6">
            {client ? (
              <Card>
                <CardHeader>
                  <CardTitle>{client.name}</CardTitle>
                  <CardDescription>{t('clientDetails')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">{t('contactInfo')}</h3>
                      <div className="space-y-3">
                        {client.contactPerson && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">{t('contact_person')}:</span>
                            <span>{client.contactPerson}</span>
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">{t('phone')}:</span>
                            <span>{client.phone}</span>
                          </div>
                        )}
                        {client.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">{t('email')}:</span>
                            <span>{client.email}</span>
                          </div>
                        )}
                        {client.address && (
                          <div className="flex items-start">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="text-muted-foreground block">{t('address')}:</span>
                              <p className="text-sm mt-1">{client.address}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {client.notes && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">{t('notes')}</h3>
                        <p>{client.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Link href={`/clients/${client.id}`}>
                    <Button variant="outline">
                      {t('viewClientProfile')}
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>{t('No client information available')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="routes" className="mt-6">
            {routes && routes.length > 0 ? (
              <div className="space-y-6">
                {routes.map((route) => (
                  <Card key={route.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{route.startPoint} → {route.endPoint}</CardTitle>
                        <Badge className={`${getStatusColors(route.status).bg} ${getStatusColors(route.status).text}`}>
                          {t(route.status)}
                        </Badge>
                      </div>
                      <CardDescription>
                        {t('routeId')}: {route.id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">{t('startPoint')}:</span>
                            <span>{route.startPoint}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">{t('endPoint')}:</span>
                            <span>{route.endPoint}</span>
                          </div>
                          {route.startDate && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-muted-foreground mr-1">{t('startDate')}:</span>
                              <span>{formatDate(route.startDate)}</span>
                            </div>
                          )}
                          {route.endDate && (
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                              <span className="text-muted-foreground mr-1">{t('endDate')}:</span>
                              <span>{formatDate(route.endDate)}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">{t('vehicle')}:</span>
                            <span>{route.vehicleId || '-'}</span>
                          </div>
                          {typeof route.progress === 'number' && (
                            <div>
                              <div className="flex items-center mb-1">
                                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                                <span className="text-muted-foreground mr-1">{t('progress')}:</span>
                                <span>{route.progress}%</span>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full" 
                                  style={{ width: `${route.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                          {route.notes && (
                            <div className="flex items-start pt-2">
                              <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                              <div>
                                <span className="text-muted-foreground block">{t('notes')}:</span>
                                <p className="text-sm mt-1">{route.notes}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Link href={`/routes/${route.id}`}>
                        <Button variant="outline">
                          {t('viewRouteDetails')}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>{t('No routes available for this order')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="carriers" className="mt-6">
            {carriers && carriers.length > 0 ? (
              <div className="space-y-6">
                {carriers.map((carrier) => (
                  <Card key={carrier.id}>
                    <CardHeader>
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {carrier.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{carrier.name}</CardTitle>
                          <CardDescription>{t('carrier')}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {carrier.contactPerson && (
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">{t('contact_person')}:</span>
                            <span>{carrier.contactPerson}</span>
                          </div>
                        )}
                        {carrier.phone && (
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">{t('phone')}:</span>
                            <span>{carrier.phone}</span>
                          </div>
                        )}
                        {carrier.email && (
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="text-muted-foreground mr-1">{t('email')}:</span>
                            <span>{carrier.email}</span>
                          </div>
                        )}
                        {carrier.notes && (
                          <div className="flex items-start pt-2">
                            <MessageCircle className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                            <div>
                              <span className="text-muted-foreground block">{t('notes')}:</span>
                              <p className="text-sm mt-1">{carrier.notes}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Link href={`/carriers/${carrier.id}`}>
                        <Button variant="outline">
                          {t('viewCarrierProfile')}
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>{t('No carriers assigned to this order')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
