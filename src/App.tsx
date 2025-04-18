import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from "@/hooks/useTheme";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import Index from './pages/Index';
import Goals from './pages/Goals';
import Industry from './pages/Industry';
import Planning from './pages/Planning';
import Settings from './pages/Settings';
import Teams from './pages/Teams';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AccessDenied from './pages/AccessDenied';
import OrganizationManagement from './pages/OrganizationManagement';
import Analytics from './pages/Analytics';
import MfaVerify from './pages/MfaVerify';
import Admin from './pages/Admin';
import { useRealTimeUpdates } from '@/hooks/useRealTimeUpdates';
import { logAuditEvent } from '@/services/auditService';
import SEO from '@/components/SEO';
import SecurityHeaders from '@/components/SecurityHeaders';
import AuthGuard from '@/components/AuthGuard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  const { setupRealtimeListeners, cleanupRealtimeListeners } = useRealTimeUpdates();
  
  useEffect(() => {
    logAuditEvent({
      action: 'settings_change',
      resource: 'setting',
      description: 'Application started',
      severity: 'low'
    });
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        logAuditEvent({
          action: 'settings_change',
          resource: 'setting',
          description: 'Application backgrounded',
          severity: 'low'
        });
      } else {
        logAuditEvent({
          action: 'settings_change',
          resource: 'setting',
          description: 'Application foregrounded',
          severity: 'low'
        });
      }
    };
    
    const handleUnload = () => {
      logAuditEvent({
        action: 'settings_change',
        resource: 'setting',
        description: 'Application closed',
        severity: 'low'
      });
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleUnload);
    
    const channels = setupRealtimeListeners();
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
      cleanupRealtimeListeners(channels);
    };
  }, [setupRealtimeListeners, cleanupRealtimeListeners]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <Router>
              <SEO />
              <SecurityHeaders />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                
                <Route path="/goals" element={
                  <AuthGuard>
                    <Goals />
                  </AuthGuard>
                } />
                <Route path="/industry" element={
                  <AuthGuard>
                    <Industry />
                  </AuthGuard>
                } />
                <Route path="/planning" element={
                  <AuthGuard>
                    <Planning />
                  </AuthGuard>
                } />
                <Route path="/teams" element={
                  <AuthGuard>
                    <Teams />
                  </AuthGuard>
                } />
                <Route path="/settings" element={
                  <AuthGuard>
                    <Settings />
                  </AuthGuard>
                } />
                <Route path="/profile" element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } />
                <Route path="/organization-management" element={
                  <AuthGuard>
                    <OrganizationManagement />
                  </AuthGuard>
                } />
                <Route path="/analytics" element={
                  <AuthGuard>
                    <Analytics />
                  </AuthGuard>
                } />
                <Route path="/mfa-verify" element={<MfaVerify />} />
                <Route path="/admin" element={
                  <AuthGuard requiredRoles={['admin']}>
                    <Admin />
                  </AuthGuard>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster position="top-right" />
            </Router>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
