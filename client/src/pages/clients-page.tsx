import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, RefreshCw, Edit, Mail, Phone } from "lucide-react";
import { Client } from "@shared/schema";
// Удален импорт ClientDialog, так как теперь используем отдельные страницы

export default function ClientsPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  // Удалены переменные для модального окна, теперь используем страницы

  const { data: clients = [], isLoading, refetch } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.contactPerson && client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.email && client.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (client.phone && client.phone.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Заменяем обработчики модальных окон на переходы на страницы

  return (
    <MainLayout title={t("clients")}>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("clients")}</h1>
          <Link href="/clients/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> {t("add_client")}
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t("client_list")}</CardTitle>
            <CardDescription>{t("manage_clients_desc")}</CardDescription>
            <div className="flex mt-2 space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t("search_clients")}
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
            ) : filteredClients.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("client_name")}</TableHead>
                      <TableHead>{t("contact_person")}</TableHead>
                      <TableHead>{t("contact_info")}</TableHead>
                      <TableHead>{t("address")}</TableHead>
                      <TableHead className="w-[100px] text-right">{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>{client.contactPerson || "-"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {client.email && (
                              <div className="flex items-center text-sm">
                                <Mail className="mr-1 h-3 w-3" />
                                <span>{client.email}</span>
                              </div>
                            )}
                            {client.phone && (
                              <div className="flex items-center text-sm">
                                <Phone className="mr-1 h-3 w-3" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                            {!client.email && !client.phone && "-"}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate">
                          {client.address || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/clients/${client.id}/edit`}>
                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <p className="text-lg font-medium mb-2">{t("no_clients_found")}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery
                    ? t("no_clients_match_filter")
                    : t("no_clients_yet")}
                </p>
                {searchQuery ? (
                  <Button variant="ghost" onClick={() => setSearchQuery("")}>
                    {t("clear_search")}
                  </Button>
                ) : (
                  <Link href="/clients/create">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> {t("add_first_client")}
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Модальное окно больше не используется, вместо него отдельные страницы */}
    </MainLayout>
  );
}
