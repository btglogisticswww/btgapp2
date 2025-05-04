import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, RefreshCw, Edit, Mail, Phone, Truck } from "lucide-react";
import { Carrier } from "@shared/schema";

export default function CarriersPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: carriers = [], isLoading, refetch } = useQuery<Carrier[]>({
    queryKey: ["/api/carriers"],
  });

  const filteredCarriers = carriers.filter((carrier) =>
    carrier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (carrier.contactPerson && carrier.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (carrier.email && carrier.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (carrier.phone && carrier.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddNewCarrier = () => {
    navigate("/carriers/create");
  };

  const handleEditCarrier = (carrier: Carrier) => {
    navigate(`/carriers/${carrier.id}/edit`);
  };



  return (
    <MainLayout title={t("carriers")}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("carriers")}</h1>
          <Button onClick={handleAddNewCarrier}>
            <Plus className="mr-2 h-4 w-4" /> {t("add_carrier")}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("carrier_list")}</CardTitle>
            <CardDescription>{t("manage_carriers_desc")}</CardDescription>
            <div className="flex mt-2 space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("search_carriers")}
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="icon" onClick={() => refetch()}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredCarriers.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("carrier_name")}</TableHead>
                      <TableHead>{t("contact_person")}</TableHead>
                      <TableHead>{t("contact_info")}</TableHead>
                      <TableHead>{t("vehicle_type")}</TableHead>
                      <TableHead className="w-[100px] text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCarriers.map((carrier) => (
                      <TableRow key={carrier.id}>
                        <TableCell className="font-medium">{carrier.name}</TableCell>
                        <TableCell>{carrier.contactPerson || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {carrier.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="mr-1 h-3 w-3" />
                                <span>{carrier.email}</span>
                              </div>
                            )}
                            {carrier.phone && (
                              <div className="flex items-center text-sm">
                                <Phone className="mr-1 h-3 w-3" />
                                <span>{carrier.phone}</span>
                              </div>
                            )}
                            {!carrier.email && !carrier.phone && "-"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {carrier.vehicleType ? (
                            <div className="flex items-center">
                              <Truck className="mr-1 h-4 w-4" />
                              <span>{carrier.vehicleType}</span>
                            </div>
                          ) : "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditCarrier(carrier)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-lg font-medium mb-2">{t("no_carriers_found")}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? t("no_carriers_match_filter")
                    : t("no_carriers_yet")}
                </p>
                {searchQuery ? (
                  <Button variant="ghost" onClick={() => setSearchQuery("")}>  
                    {t("clear_search")}
                  </Button>
                ) : (
                  <Button onClick={handleAddNewCarrier}>
                    <Plus className="mr-2 h-4 w-4" /> {t("add_first_carrier")}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

    </MainLayout>
  );
}
