import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import AuthGuard from "@/components/AuthGuard";
import React, { useEffect, lazy, Suspense } from 'react';
import { logAuditEvent } from "./services/auditService";

// Dynamic imports for code splitting
const Index = lazy(() => import("./pages/Index"));
const Industry = lazy(() => import("./pages/Industry"));
const Planning = lazy(() => import("./pages/Planning"));
const Goals = lazy(() => import("./pages/Goals"));
const Resources = lazy(() => import("./pages/Resources"));
const Settings = lazy(() => import("./pages/Settings"));
const Profile = lazy(() => import("./pages/Profile"));
const Teams = lazy(() => import("./pages/Teams"));
const Admin = lazy(() => import("./pages/Admin"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AccessDenied = lazy(() => import("./pages/AccessDenied"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Analytics = lazy(() => import("./pages/Analytics"));

// Create a QueryClient with optimized settings for better performance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optimize aggressive refetching behavior for better performance
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: 1,
      // Modern error handling approach for React Query v5+
      meta: {
        errorHandler: (error: Error) => {
          console.error("Query error:", error);
        }
      }
    },
    mutations: {
      // Modern error handling approach for React Query v5+
      meta: {
        errorHandler: (error: Error) => {
          console.error("Mutation error:", error);
        }
      }
    },
  },
});

// Loading fallback component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

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
    
    // Performance monitoring
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Create performance observer for layout shifts
      const layoutShiftObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          // Using type assertion to access layout shift properties
          const layoutShiftEntry = entry as unknown as { hadRecentInput?: boolean };
          if (!layoutShiftEntry.hadRecentInput) {
            console.warn('Layout shift detected:', entry);
          }
        }
      });
      
      // Create performance observer for long tasks
      const longTaskObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.warn('Long task detected:', entry.duration, 'ms', entry);
        }
      });
      
      // Register observers
      try {
        layoutShiftObserver.observe({ type: 'layout-shift', buffered: true });
        longTaskObserver.observe({ type: 'longtask', buffered: true });
      } catch (e) {
        console.error('Performance observer error:', e);
      }
    }
    
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
                <Suspense fallback={<PageLoader />}>
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
                </Suspense>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
