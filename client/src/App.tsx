import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/hooks/use-language";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login-page";
import DashboardPage from "@/pages/dashboard-page";
import OrdersPage from "@/pages/orders-page";
import OrderDetailPage from "@/pages/order-detail-page";
import CreateOrderPage from "@/pages/create-order-page";
import EditOrderPage from "@/pages/edit-order-page";
import RoutesPage from "@/pages/routes-page";
import ClientsPage from "@/pages/clients-page";
import CreateClientPage from "@/pages/create-client-page";
import EditClientPage from "@/pages/edit-client-page";
import CarriersPage from "@/pages/carriers-page";
import CreateCarrierPage from "@/pages/create-carrier-page";
import EditCarrierPage from "@/pages/edit-carrier-page";
import AddRoutePage from "@/pages/add-route-page";
import TransportationRequestsPage from "@/pages/transportation-requests-page";
import TransportationRequestDetailPage from "@/pages/transportation-request-detail-page";
import CreateTransportationRequestPage from "@/pages/create-transportation-request-page";
import EditTransportationRequestPage from "@/pages/edit-transportation-request-page";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/auth" component={LoginPage} />
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/orders" component={OrdersPage} />
      <ProtectedRoute path="/orders/create" component={CreateOrderPage} />
      <ProtectedRoute path="/orders/:id/edit" component={EditOrderPage} />
      <ProtectedRoute path="/orders/:id" component={OrderDetailPage} />
      <ProtectedRoute path="/routes" component={RoutesPage} />
      <ProtectedRoute path="/clients" component={ClientsPage} />
      <ProtectedRoute path="/clients/create" component={CreateClientPage} />
      <ProtectedRoute path="/clients/:id/edit" component={EditClientPage} />
      <ProtectedRoute path="/carriers" component={CarriersPage} />
      <ProtectedRoute path="/carriers/create" component={CreateCarrierPage} />
      <ProtectedRoute path="/carriers/:id/edit" component={EditCarrierPage} />
      <ProtectedRoute path="/orders/:id/add-route" component={AddRoutePage} />
      <ProtectedRoute path="/transportation-requests" component={TransportationRequestsPage} />
      <ProtectedRoute path="/transportation-requests/create" component={CreateTransportationRequestPage} />
      <ProtectedRoute path="/transportation-requests/:id" component={TransportationRequestDetailPage} />
      <ProtectedRoute path="/transportation-requests/:id/edit" component={EditTransportationRequestPage} />
      <ProtectedRoute path="/orders/:orderId/transportation-requests/create" component={CreateTransportationRequestPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router />
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
