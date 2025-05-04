import { useRoute } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import MainLayout from "@/components/layout/MainLayout";
import { TransportationRequestForm } from "@/components/transportation-requests/transportation-request-form";

export default function CreateTransportationRequestPage() {
  const { t } = useLanguage();
  const [matched, params] = useRoute("/orders/:id/transportation-requests/create");
  const orderId = matched && params?.id ? parseInt(params.id) : undefined;

  return (
    <MainLayout title={t("createTransportationRequest")}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t("createTransportationRequest")}</h1>
        <TransportationRequestForm preselectedOrderId={orderId} />
      </div>
    </MainLayout>
  );
}
