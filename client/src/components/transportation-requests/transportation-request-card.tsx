import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { TransportationRequest } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatPrice } from "@/lib/formatters";
import { getStatusColor } from "@/lib/utils";
import { Calendar, FileEdit, FileText, TruckIcon, ArrowUpRight, DollarSign } from "lucide-react";

interface TransportationRequestCardProps {
  transportationRequest: TransportationRequest;
  isStandalone?: boolean;
}

export default function TransportationRequestCard({
  transportationRequest: request,
  isStandalone = false
}: TransportationRequestCardProps) {
  const { t } = useLanguage();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <span>#{request.id}</span>
            <Badge
              variant="outline"
              className={`${getStatusColor(request.status)}`}
            >
              {t(request.status)}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Link href={`/transportation-requests/${request.id}`}>
              <Button size="sm" variant="ghost">
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href={`/transportation-requests/${request.id}/edit`}>
              <Button size="sm" variant="ghost">
                <FileEdit className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pb-3">
        <div className="flex items-center">
          <TruckIcon className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-1">{t("carrierId")}:</span>
          <span>{request.carrierId}</span>
        </div>

        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-1">{t("orderId")}:</span>
          {isStandalone ? (
            <Link href={`/orders/${request.orderId}`} className="text-primary hover:underline">
              #{request.orderId}
            </Link>
          ) : (
            <span>#{request.orderId}</span>
          )}
        </div>

        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-1">{t("deadline")}:</span>
          <span>{formatDate(request.deadline)}</span>
        </div>

        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground mr-1">{t("price")}:</span>
          <span>{formatPrice(request.price)}</span>
        </div>
      </CardContent>
      {request.notes && (
        <CardFooter className="border-t p-4 bg-muted/20">
          <div className="text-sm text-muted-foreground">
            <strong>{t("notes")}:</strong> {request.notes.substring(0, 100)}
            {request.notes.length > 100 && "..."}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
