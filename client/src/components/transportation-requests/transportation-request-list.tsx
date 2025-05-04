import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TransportationRequest } from '@shared/schema';
import { useLanguage } from '@/hooks/use-language';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import TransportationRequestCard from './transportation-request-card';
import TransportationRequestForm from './transportation-request-form';

type TransportationRequestListProps = {
  orderId: number;
};

export default function TransportationRequestList({ orderId }: TransportationRequestListProps) {
  const { t } = useLanguage();
  const [addingRequest, setAddingRequest] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);

  // Fetch transportation requests for this order
  const { data: requests, isLoading, refetch: refetchRequests } = useQuery<TransportationRequest[]>({
    queryKey: ['/api/orders', orderId, 'transportation-requests'],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}/transportation-requests`);
      if (!response.ok) {
        throw new Error('Failed to fetch transportation requests');
      }
      return await response.json();
    },
    enabled: !!orderId,
    refetchOnWindowFocus: true,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">{t('transportationRequests')}</h3>
        <Button 
          variant="ghost" 
          onClick={() => setAddingRequest(true)} 
          disabled={addingRequest || editingRequestId !== null}
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('addTransportationRequest')}
        </Button>
      </div>

      {addingRequest && (
        <div className="mb-6">
          <TransportationRequestForm
            orderId={orderId}
            onCancel={() => setAddingRequest(false)}
            onSuccess={() => {
              setAddingRequest(false);
              refetchRequests();
            }}
          />
        </div>
      )}

      {requests && requests.length > 0 ? (
        <div className="space-y-6">
          {requests.map((request) => (
            editingRequestId === request.id ? (
              <div key={request.id}>
                <TransportationRequestForm
                  orderId={orderId}
                  requestId={request.id}
                  onCancel={() => setEditingRequestId(null)}
                  onSuccess={() => {
                    setEditingRequestId(null);
                    refetchRequests();
                  }}
                />
              </div>
            ) : (
              <TransportationRequestCard
                key={request.id}
                request={request}
                onEdit={() => setEditingRequestId(request.id)}
              />
            )
          ))}
        </div>
      ) : (
        !addingRequest && (
          <Card>
            <CardContent className="p-6 text-center">
              <p>{t('noTransportationRequests')}</p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
