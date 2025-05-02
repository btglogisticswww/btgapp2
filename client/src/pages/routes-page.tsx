'use client';
import { useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import MainLayout from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { Route, Vehicle } from "@shared/schema";
import {
  Loader2,
  Search,
  SlidersHorizontal,
  Plus,
  Home,
  Maximize,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getStatusColors } from "@/lib/utils";

export default function RoutesPage() {
  const { t } = useLanguage();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  
  // Fetching routes data
  const { data: routes, isLoading: routesLoading } = useQuery<Route[]>({
    queryKey: ["/api/routes"],
  });
  
  // Fetching vehicles data
  const { data: vehicles, isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });
  
  // Filter active routes
  const activeRoutes = routes?.filter(route => 
    route.status === "active" || route.status === "pending"
  );
  
  return (
    <MainLayout title={t("routes")}>
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-foreground">{t("routesManagement")}</h1>
        
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            {t("filters")}
          </Button>
          
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("newRoute")}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Active Routes */}
          <Card>
            <CardHeader className="px-4 py-3 bg-muted">
              <CardTitle className="text-sm font-medium">{t("activeRoutes")}</CardTitle>
            </CardHeader>
            
            <div className="divide-y divide-border">
              {routesLoading ? (
                <div className="p-4 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : activeRoutes && activeRoutes.length > 0 ? (
                activeRoutes.map((route) => {
                  const statusColors = getStatusColors(route.status);
                  const isSelected = selectedRoute?.id === route.id;
                  
                  return (
                    <div 
                      key={route.id} 
                      className={`p-4 hover:bg-muted/50 cursor-pointer ${isSelected ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">
                          {route.startPoint} → {route.endPoint}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className={`${statusColors.bg} ${statusColors.text} border-0`}
                        >
                          {t(route.status)}
                        </Badge>
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>Заказ #{route.orderId}</span>
                        {route.startDate && route.endDate && (
                          <span>
                            {formatDate(route.startDate)} - {formatDate(route.endDate)}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                        <div 
                          className={route.status === "active" ? "bg-green-500 h-1.5 rounded-full" : 
                                  route.status === "pending" ? "bg-blue-500 h-1.5 rounded-full" :
                                  "bg-yellow-500 h-1.5 rounded-full"}
                          style={{ width: `${route.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {t("noData")}
                </div>
              )}
            </div>
          </Card>
          
          {/* Vehicles */}
          <Card>
            <CardHeader className="px-4 py-3 bg-muted">
              <CardTitle className="text-sm font-medium">{t("vehicle")}</CardTitle>
            </CardHeader>
            
            <div className="divide-y divide-border">
              {vehiclesLoading ? (
                <div className="p-4 flex justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : vehicles && vehicles.length > 0 ? (
                vehicles.slice(0, 3).map((vehicle) => {
                  const statusColors = getStatusColors(vehicle.status);
                  
                  return (
                    <div key={vehicle.id} className="p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-foreground">{vehicle.type}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${statusColors.bg} ${statusColors.text} border-0`}
                        >
                          {t(vehicle.status)}
                        </Badge>
                      </div>
                      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                        <span>{t("regNumber")}: {vehicle.regNumber}</span>
                        <span>{t("driver")}: {vehicle.driverName}</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  {t("noData")}
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Map and Route Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Map */}
          <Card>
            <CardHeader className="px-4 py-3 bg-muted flex justify-between items-center">
              <CardTitle className="text-sm font-medium">{t("routesMap")}</CardTitle>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                  <Search className="h-3 w-3 mr-1" />
                  {t("find")}
                </Button>
                
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                  <SlidersHorizontal className="h-3 w-3 mr-1" />
                  {t("filter")}
                </Button>
                
                <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                  <Maximize className="h-3 w-3 mr-1" />
                  {t("scale")}
                </Button>
              </div>
            </CardHeader>
            
            <div className="h-96 bg-muted/30 relative">
              {/* Placeholder for the map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="mt-2 text-sm text-muted-foreground">{t("routesMap")}</p>
                  <p className="text-xs text-muted-foreground/70">
                    {selectedRoute ? `${selectedRoute.startPoint} → ${selectedRoute.endPoint}` : ""}
                  </p>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="absolute top-4 right-4 bg-card rounded-lg shadow-md p-2">
                <div className="flex flex-col space-y-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="border-t border-border my-1"></div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded">
                    <Home className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          
          {/* Selected Route Details */}
          <Card>
            <CardHeader className="px-4 py-3 bg-muted">
              <CardTitle className="text-sm font-medium">{t("routeDetails")}</CardTitle>
            </CardHeader>
            
            {selectedRoute ? (
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-1">{t("startPoint")}</h3>
                      <p className="text-foreground">{selectedRoute.startPoint}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-1">{t("endPoint")}</h3>
                      <p className="text-foreground">{selectedRoute.endPoint}</p>
                    </div>
                    
                    {selectedRoute.waypoints && typeof selectedRoute.waypoints === 'string' && (
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">{t("waypoints")}</h3>
                        <div className="space-y-2">
                          {(() => {
                            try {
                              const waypoints = JSON.parse(selectedRoute.waypoints as string);
                              return waypoints.map((waypoint: any, index: number) => (
                                <div key={index} className="flex justify-between">
                                  <span>{waypoint.name}</span>
                                  <span className="text-muted-foreground">{waypoint.expected}</span>
                                </div>
                              ));
                            } catch (error) {
                              console.error("Error parsing waypoints:", error);
                              return <p className="text-destructive">Error parsing waypoints</p>;
                            }
                          })()}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-1">{t("status")}</h3>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColors(selectedRoute.status).bg} ${getStatusColors(selectedRoute.status).text} border-0`}
                      >
                        {t(selectedRoute.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-1">{t("startDate")}</h3>
                      <p className="text-foreground">{formatDate(selectedRoute.startDate)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-1">{t("endDate")}</h3>
                      <p className="text-foreground">{formatDate(selectedRoute.endDate)}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm text-muted-foreground mb-1">{t("progress")}</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className={selectedRoute.status === "active" ? "bg-green-500 h-2.5 rounded-full" : 
                                    selectedRoute.status === "pending" ? "bg-blue-500 h-2.5 rounded-full" :
                                    "bg-yellow-500 h-2.5 rounded-full"}
                            style={{ width: `${selectedRoute.progress || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{selectedRoute.progress || 0}%</span>
                      </div>
                    </div>
                    
                    {selectedRoute.notes && (
                      <div>
                        <h3 className="text-sm text-muted-foreground mb-1">{t("notes")}</h3>
                        <p className="text-foreground text-sm">{selectedRoute.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            ) : (
              <CardContent className="p-4 text-center text-muted-foreground">
                {t("noData")}
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
