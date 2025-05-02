'use client';
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { formatCurrency, formatDate, getStatusColors, getInitials } from "@/lib/utils";
import { Link } from "wouter";
import { 
  Loader2,
  Search,
  SlidersHorizontal,
  Plus
} from "lucide-react";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function OrdersPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: orders, isLoading, error } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });
  
  // Filter orders based on active tab and search query
  const filteredOrders = orders?.filter(order => {
    // Filter by tab
    if (activeTab !== 'all' && order.status !== activeTab) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !order.route.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });
  
  // Handle order selection
  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
  };
  
  return (
    <MainLayout title={t("orders")}>
      {/* Tabs */}
      <div className="mb-6 border-b border-border">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-background border-b-0">
            <TabsTrigger value="all">{t("all")}</TabsTrigger>
            <TabsTrigger value="active">{t("active")}</TabsTrigger>
            <TabsTrigger value="pending">{t("pending")}</TabsTrigger>
            <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10" 
            placeholder={t("search")} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
            <SlidersHorizontal className="h-4 w-4" />
            {t("filters")}
          </Button>
          
          <Button className="flex items-center gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            {t("newOrder")}
          </Button>
        </div>
      </div>
      
      {/* Orders List and Details */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Orders List */}
        <div className="w-full lg:w-3/5">
          <Card>
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="p-4 text-destructive">
                {(error as Error).message || t("noData")}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("id")}</TableHead>
                      <TableHead>{t("client")}</TableHead>
                      <TableHead>{t("route")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("date")}</TableHead>
                      <TableHead>{t("price")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders && filteredOrders.length > 0 ? (
                      filteredOrders.map((order) => {
                        const isSelected = selectedOrder?.id === order.id;
                        const statusColors = getStatusColors(order.status);
                        
                        return (
                          <TableRow 
                            key={order.id} 
                            className={`cursor-pointer ${isSelected ? 'bg-muted' : ''}`}
                            onClick={() => handleOrderSelect(order)}
                          >
                            <TableCell className="font-medium text-primary">
                              {order.orderNumber}
                            </TableCell>
                            <TableCell>{order.clientId}</TableCell>
                            <TableCell>{order.route}</TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={`${statusColors.bg} ${statusColors.text} border-0`}
                              >
                                {t(order.status)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDate(order.orderDate)}
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(order.price)}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {t("noData")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </div>
        
        {/* Order Details */}
        <div className="w-full lg:w-2/5">
          {selectedOrder ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>
                    <Link href={`/orders/${selectedOrder.id}`} className="hover:underline">
                      {t("orderDetails")}
                    </Link>
                  </span>
                  <Badge 
                    variant="outline" 
                    className={`${getStatusColors(selectedOrder.status).bg} ${getStatusColors(selectedOrder.status).text} border-0`}
                  >
                    {t(selectedOrder.status)}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {selectedOrder.orderNumber} • {formatDate(selectedOrder.orderDate)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    {/* General Info */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">{t("generalInfo")}</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">{t("type")}</p>
                          <p>{selectedOrder.type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("price")}</p>
                          <p>{formatCurrency(selectedOrder.price)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("weight")}</p>
                          <p>{selectedOrder.weight}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("volume")}</p>
                          <p>{selectedOrder.volume}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("manager")}</p>
                          <p>{selectedOrder.managerId}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Route Info */}
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">{t("route")}</h3>
                      <div className="text-sm">
                        <div className="mb-2">
                          <p className="text-muted-foreground">{t("sender")}</p>
                          <p>{selectedOrder.originAddress}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("recipient")}</p>
                          <p>{selectedOrder.destinationAddress}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Cargo Info if available */}
                    {selectedOrder.details && typeof selectedOrder.details === 'string' && (
                      (() => {
                        try {
                          const details = JSON.parse(selectedOrder.details as string);
                          return (
                            <>
                              {/* Sender Details */}
                              {details.sender && (
                                <div>
                                  <h3 className="text-sm font-medium text-foreground mb-2">{t("senderInfo")}</h3>
                                  <div className="text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-muted-foreground">{t("name")}</p>
                                        <p>{details.sender.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">{t("contact")}</p>
                                        <p>{details.sender.contact}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">{t("phone")}</p>
                                        <p>{details.sender.phone}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">{t("address")}</p>
                                        <p>{details.sender.address}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Recipient Details */}
                              {details.recipient && (
                                <div>
                                  <h3 className="text-sm font-medium text-foreground mb-2">{t("recipientInfo")}</h3>
                                  <div className="text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-muted-foreground">{t("name")}</p>
                                        <p>{details.recipient.name}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">{t("contact")}</p>
                                        <p>{details.recipient.contact}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">{t("phone")}</p>
                                        <p>{details.recipient.phone}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">{t("address")}</p>
                                        <p>{details.recipient.address}</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {/* Cargo Details */}
                              {details.cargo && (
                                <div>
                                  <h3 className="text-sm font-medium text-foreground mb-2">{t("cargoInfo")}</h3>
                                  <div className="text-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-muted-foreground">{t("description")}</p>
                                        <p>{details.cargo.description}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">{t("packaging")}</p>
                                        <p>{details.cargo.packaging}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">{t("hazardClass")}</p>
                                        <p>{details.cargo.hazardClass}</p>
                                      </div>
                                      <div>
                                        <p className="text-muted-foreground">{t("temperature")}</p>
                                        <p>{details.cargo.temperature}</p>
                                      </div>
                                    </div>
                                    
                                    {details.cargo.documents && details.cargo.documents.length > 0 && (
                                      <div className="mt-4">
                                        <p className="text-muted-foreground mb-2">{t("docs")}</p>
                                        <ul className="list-disc list-inside">
                                          {details.cargo.documents.map((doc: string, index: number) => (
                                            <li key={index}>{doc}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              {/* Timeline */}
                              {details.timeline && details.timeline.length > 0 && (
                                <div>
                                  <h3 className="text-sm font-medium text-foreground mb-2">{t("timeline")}</h3>
                                  <div className="space-y-4">
                                    {details.timeline.map((event: any, index: number) => (
                                      <div key={index} className="flex">
                                        <div className="mr-4 relative">
                                          <div className="h-4 w-4 rounded-full bg-primary"></div>
                                          {index < details.timeline.length - 1 && (
                                            <div className="h-full w-0.5 bg-border absolute top-4 left-1/2 -translate-x-1/2"></div>
                                          )}
                                        </div>
                                        <div className="pb-4">
                                          <p className="text-sm text-foreground font-medium">{event.event}</p>
                                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                                            <span>{event.date}</span>
                                            {event.time && (
                                              <span className="ml-2">{event.time}</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </>
                          );
                        } catch (error) {
                          console.error("Error parsing order details:", error);
                          return null;
                        }
                      })()
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <div className="p-6 text-center">
                <p className="text-muted-foreground">{t("noData")}</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
