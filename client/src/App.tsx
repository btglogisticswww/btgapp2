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
import RoutesPage from "@/pages/routes-page";
import ClientsPage from "@/pages/clients-page";
import CarriersPage from "@/pages/carriers-page";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/auth" component={LoginPage} />
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/orders" component={OrdersPage} />
      <ProtectedRoute path="/orders/:id" component={OrderDetailPage} />
      <ProtectedRoute path="/routes" component={RoutesPage} />
      <ProtectedRoute path="/clients" component={ClientsPage} />
      <ProtectedRoute path="/carriers" component={CarriersPage} />
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
