import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "@/lib/nav-items";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MfaVerify from "./pages/MfaVerify";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Goals from "./pages/Goals";
import Planning from "./pages/Planning";
import Analytics from "./pages/Analytics";
import Industry from "./pages/Industry";
import Teams from "./pages/Teams";
import Resources from "./pages/Resources";
import Admin from "./pages/Admin";
import OrganizationManagement from "./pages/OrganizationManagement";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import DataFoundryPage from "./pages/DataFoundry";
import AIOperationsPage from "./pages/AIOperations";
import AuthGuard from "./components/AuthGuard";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { LanguageProvider } from "@/i18n";
import IntegratedAppExperience from "@/components/IntegratedAppExperience";
import ErrorBoundary from "@/components/ErrorBoundary";
import SecurityHeaders from "@/components/SecurityHeaders";
import SEO from "@/components/SEO";
import { useRealTimeUpdates } from "@/hooks/useRealTimeUpdates";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppWithRealTime() {
  const { setupRealtimeListeners, cleanupRealtimeListeners } = useRealTimeUpdates();
  
  useEffect(() => {
    const channels = setupRealtimeListeners();
    
    return () => {
      cleanupRealtimeListeners(channels);
    };
  }, [setupRealtimeListeners, cleanupRealtimeListeners]);
  
  return (
    <BrowserRouter>
      <SEO />
      <SecurityHeaders />
      <ErrorBoundary>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/mfa-verify" element={<MfaVerify />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          
          {/* Protected routes */}
          <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
          <Route path="/goals" element={<AuthGuard><Goals /></AuthGuard>} />
          <Route path="/planning" element={<AuthGuard><Planning /></AuthGuard>} />
          <Route path="/analytics" element={<AuthGuard><Analytics /></AuthGuard>} />
          <Route path="/industry" element={<AuthGuard><Industry /></AuthGuard>} />
          <Route path="/teams" element={<AuthGuard><Teams /></AuthGuard>} />
          <Route path="/resources" element={<AuthGuard><Resources /></AuthGuard>} />
          <Route path="/data-foundry" element={<AuthGuard><DataFoundryPage /></AuthGuard>} />
          <Route path="/ai-operations" element={<AuthGuard><AIOperationsPage /></AuthGuard>} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AuthGuard requiredRoles={["admin"]}><Admin /></AuthGuard>} />
          <Route path="/organization" element={<AuthGuard requiredRoles={["admin"]}><OrganizationManagement /></AuthGuard>} />
          
          {/* 404 fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <IntegratedAppExperience />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <AppWithRealTime />
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
