import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/hooks/use-language';
import { TransportationRequest } from '@shared/schema';
import TransportationRequestCard from './transportation-request-card';
import TransportationRequestForm from './transportation-request-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2 } from 'lucide-react';

type TransportationRequestListProps = {
  orderId: number;
};

export default function TransportationRequestList({ orderId }: TransportationRequestListProps) {
  const { t } = useLanguage();
  const [isAddingRequest, setIsAddingRequest] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  // Fetch transportation requests for this order
  const { data: requests, isLoading, refetch } = useQuery<TransportationRequest[]>({
    queryKey: ['/api/orders', orderId, 'transportation-requests'],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${orderId}/transportation-requests`);
      if (!response.ok) {
        throw new Error('Failed to fetch transportation requests');
      }
      return response.json();
    },
    enabled: !!orderId,
  });

  // Filter requests by status
  const filteredRequests = requests?.filter(request => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return request.status === 'pending_approval';
    if (activeTab === 'accepted') return request.status === 'accepted';
    if (activeTab === 'rejected') return request.status === 'rejected';
    return true;
  });

  // Handle form success
  const handleFormSuccess = () => {
    setIsAddingRequest(false);
    setEditingRequestId(null);
    refetch();
  };

  // Handle edit button click
  const handleEdit = (id: number) => {
    setEditingRequestId(id);
    setIsAddingRequest(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{t('transportationRequests')}</h2>
        {!isAddingRequest && !editingRequestId && (
          <Button onClick={() => setIsAddingRequest(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('addTransportationRequest')}
          </Button>
        )}
      </div>

      {isAddingRequest && (
        <TransportationRequestForm
          orderId={orderId}
          onSuccess={handleFormSuccess}
          onCancel={() => setIsAddingRequest(false)}
        />
      )}

      {editingRequestId && (
        <TransportationRequestForm
          orderId={orderId}
          requestId={editingRequestId}
          onSuccess={handleFormSuccess}
          onCancel={() => setEditingRequestId(null)}
        />
      )}

      {!isAddingRequest && !editingRequestId && (
        <Card>
          <CardHeader className="pb-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start border-b border-border">
                <TabsTrigger 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground" 
                  value="all"
                >
                  {t('all')}
                </TabsTrigger>
                <TabsTrigger 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground" 
                  value="pending"
                >
                  {t('pending')}
                </TabsTrigger>
                <TabsTrigger 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground" 
                  value="accepted"
                >
                  {t('accepted')}
                </TabsTrigger>
                <TabsTrigger 
                  className="data-[state=active]:border-b-2 data-[state=active]:border-sidebar-primary data-[state=active]:text-sidebar-primary data-[state=inactive]:text-muted-foreground" 
                  value="rejected"
                >
                  {t('rejected')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="pt-4">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : filteredRequests && filteredRequests.length > 0 ? (
              <div className="space-y-4">
                {filteredRequests.map((request) => (
                  <TransportationRequestCard
                    key={request.id}
                    request={request}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-muted-foreground">{t('noData')}</p>
                <p className="text-sm text-muted-foreground">{t('noTransportationRequests')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
