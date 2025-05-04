import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Truck, Calendar, DollarSign, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useLanguage } from '@/hooks/use-language';
import { TransportationRequest } from '@shared/schema';

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

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'destructive';
      case 'pending_approval':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center">
            <Truck className="h-5 w-5 mr-2 text-sidebar-primary" />
            <h4 className="text-lg font-medium">{t('carrier')}: {request.carrierName}</h4>
          </div>
          <Badge variant={getStatusBadgeVariant(request.status) as any}>
            {t(request.status)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">{t('transportationType')}:</span>
              <span>{request.transportationType}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">{t('scheduledDate')}:</span>
              <span>{formatDate(request.scheduledDate)}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">{t('offeredPrice')}:</span>
              <span>{formatCurrency(Number(request.offeredPrice))}</span>
            </div>
          </div>
          <div>
            {request.specialRequirements && (
              <div className="space-y-1">
                <span className="text-muted-foreground">{t('specialRequirements')}:</span>
                <p className="text-sm">{request.specialRequirements}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      {onEdit && (
        <CardFooter className="bg-muted/50 p-4 flex justify-end">
          <Button
            variant="ghost"
            onClick={() => onEdit(request.id)}
            disabled={disabled}
          >
            <Edit className="h-4 w-4 mr-2" />
            {t('edit')}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
