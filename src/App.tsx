
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import Industry from "./pages/Industry";
import Planning from "./pages/Planning";
import Goals from "./pages/Goals";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Teams from "./pages/Teams";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AccessDenied from "./pages/AccessDenied";
import NotFound from "./pages/NotFound";
import Analytics from "./pages/Analytics";
import React, { useEffect } from 'react';
import { logAuditEvent } from "./services/auditService";

// Create a QueryClient with optimized settings for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optimize aggressive refetching behavior for better performance
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1,
      // Improve suspense mode behavior
      suspense: false,
      // Add error handling
      onError: (error) => {
        console.error("Query error:", error);
      },
    },
    mutations: {
      // Add error handling
      onError: (error) => {
        console.error("Mutation error:", error);
      },
    },
  },
});

const App: React.FC = () => {
  // Log application startup
  useEffect(() => {
    logAuditEvent({
      action: 'settings_change',
      resource: 'setting',
      description: 'Application started',
      severity: 'low',
    });
    
    // Add window unload event for cleanup
    const handleUnload = () => {
      logAuditEvent({
        action: 'settings_change',
        resource: 'setting',
        description: 'Application closed',
        severity: 'low',
      });
    };
    
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);
  
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/access-denied" element={<AccessDenied />} />
                  
                  <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
                  <Route path="/analytics" element={<AuthGuard><Analytics /></AuthGuard>} />
                  <Route path="/industry" element={<AuthGuard requiredRoles={['analyst', 'manager', 'admin']} resourceType="industry"><Industry /></AuthGuard>} />
                  <Route path="/planning" element={<AuthGuard requiredRoles={['manager', 'admin']} resourceType="planning"><Planning /></AuthGuard>} />
                  <Route path="/goals" element={<AuthGuard resourceType="goal"><Goals /></AuthGuard>} />
                  <Route path="/resources" element={<AuthGuard requiredRoles={['analyst', 'manager', 'admin']} resourceType="resource"><Resources /></AuthGuard>} />
                  <Route path="/teams" element={<AuthGuard requiredRoles={['manager', 'admin']} resourceType="team"><Teams /></AuthGuard>} />
                  <Route path="/settings" element={<AuthGuard resourceType="setting"><Settings /></AuthGuard>} />
                  <Route path="/profile" element={<AuthGuard resourceType="user"><Profile /></AuthGuard>} />
                  <Route path="/admin" element={<AuthGuard requiredRoles={['admin']} resourceType="admin" actionType="admin"><Admin /></AuthGuard>} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
