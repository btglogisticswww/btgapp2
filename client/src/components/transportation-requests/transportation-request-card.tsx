import { useLanguage } from '@/hooks/use-language';
import { TransportationRequest } from '@shared/schema';
import { formatCurrency, formatDate, getStatusColors } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Truck,
  Calendar,
  MapPin,
  Building,
  DollarSign,
  FileText,
  Edit,
} from 'lucide-react';

type TransportationRequestCardProps = {
  request: TransportationRequest;
  onEdit?: (id: number) => void;
  disabled?: boolean;
};

export default function TransportationRequestCard({
  request,
  onEdit,
  disabled = false,
}: TransportationRequestCardProps) {
  const { t } = useLanguage();
  
  // Get colors for status badge
  const statusColors = getStatusColors(request.status);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold">{request.carrierName}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              <span>{formatDate(request.scheduledDate.toString())}</span>
            </div>
          </div>
          <Badge variant="secondary" className={`${statusColors.bg} ${statusColors.text} border-0`}>
            {t(request.status)}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground mr-1">{t('vehicle')}:</span>
            <span>{request.vehicleId ? `ID: ${request.vehicleId}` : t('no_vehicle')}</span>
          </div>

          <div className="flex items-center">
            <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground mr-1">{t('price')}:</span>
            <span>{request.price ? formatCurrency(Number(request.price)) : t('no_price')}</span>
          </div>

          <div className="flex items-center">
            <Building className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground mr-1">{t('carrier')}:</span>
            <span>{t('carrier_id')}: {request.carrierId}</span>
          </div>


        </div>
      </CardContent>

      {onEdit && !disabled && (
        <CardFooter className="bg-muted/30 px-5 py-2">
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => onEdit(request.id)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {t('edit')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
