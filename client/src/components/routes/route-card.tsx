import { Route } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { formatDate, getStatusColors } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, FileEdit, Truck } from "lucide-react";

interface RouteCardProps {
  route: Route;
  onEdit: (routeId: number) => void;
  disabled?: boolean;
}

export default function RouteCard({ route, onEdit, disabled = false }: RouteCardProps) {
  const { t } = useLanguage();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{route.startPoint} → {route.endPoint}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className={`${getStatusColors(route.status).bg} ${getStatusColors(route.status).text} border-0`}>
              {t(route.status)}
            </Badge>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(route.id)}
              disabled={disabled}
            >
              <FileEdit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground mr-1">{t('startDate')}:</span>
            <span>{formatDate(route.startDate)}</span>
          </div>
          {route.vehicleId && (
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">{t('vehicle')}:</span>
              <span>ID: {route.vehicleId}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
