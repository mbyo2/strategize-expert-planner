
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
import SimpleAuthGuard from "./components/SimpleAuthGuard";
import SimpleAuthForm from "./components/SimpleAuthForm";
import { SimpleAuthProvider } from "@/hooks/useSimpleAuth";
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
          {/* Public routes - using the new simplified auth form */}
          <Route path="/login" element={<SimpleAuthForm />} />
          <Route path="/signup" element={<SimpleAuthForm />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/mfa-verify" element={<MfaVerify />} />
          <Route path="/access-denied" element={<AccessDenied />} />
          
          {/* Protected routes using SimpleAuthGuard */}
          <Route path="/" element={<SimpleAuthGuard><Index /></SimpleAuthGuard>} />
          <Route path="/profile" element={<SimpleAuthGuard><Profile /></SimpleAuthGuard>} />
          <Route path="/settings" element={<SimpleAuthGuard><Settings /></SimpleAuthGuard>} />
          <Route path="/goals" element={<SimpleAuthGuard><Goals /></SimpleAuthGuard>} />
          <Route path="/planning" element={<SimpleAuthGuard><Planning /></SimpleAuthGuard>} />
          <Route path="/analytics" element={<SimpleAuthGuard><Analytics /></SimpleAuthGuard>} />
          <Route path="/industry" element={<SimpleAuthGuard><Industry /></SimpleAuthGuard>} />
          <Route path="/teams" element={<SimpleAuthGuard><Teams /></SimpleAuthGuard>} />
          <Route path="/resources" element={<SimpleAuthGuard><Resources /></SimpleAuthGuard>} />
          <Route path="/data-foundry" element={<SimpleAuthGuard><DataFoundryPage /></SimpleAuthGuard>} />
          <Route path="/ai-operations" element={<SimpleAuthGuard><AIOperationsPage /></SimpleAuthGuard>} />
          
          {/* Admin routes with role requirements */}
          <Route path="/admin" element={<SimpleAuthGuard requiredRole="admin"><Admin /></SimpleAuthGuard>} />
          <Route path="/organization" element={<SimpleAuthGuard requiredRole="admin"><OrganizationManagement /></SimpleAuthGuard>} />
          
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
          <SimpleAuthProvider>
            <TooltipProvider>
              <AppWithRealTime />
              <Toaster />
            </TooltipProvider>
          </SimpleAuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
