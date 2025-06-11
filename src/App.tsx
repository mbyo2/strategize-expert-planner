import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient } from '@tanstack/react-query';

import Dashboard from '@/pages/Dashboard';
import Goals from '@/pages/Goals';
import Planning from '@/pages/Planning';
import Analytics from '@/pages/Analytics';
import Industry from '@/pages/Industry';
import Teams from '@/pages/Teams';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Admin from '@/pages/Admin';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import AuthGuard from '@/components/AuthGuard';
import SEO from '@/components/SEO';
import SecurityHeaders from '@/components/SecurityHeaders';
import ErrorBoundary from '@/components/ErrorBoundary';
import { useAuth } from '@/hooks/useAuth';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import Integrations from "@/pages/Integrations";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <QueryClient>
        <AnalyticsProvider>
          <BrowserRouter>
            <AuthGuard>
              <div className="min-h-screen bg-background">
                <SEO />
                <SecurityHeaders />
                <ErrorBoundary>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/planning" element={<Planning />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/industry" element={<Industry />} />
                    <Route path="/teams" element={<Teams />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<Navigate to="/404" replace />} />
                    <Route path="/integrations" element={<Integrations />} />
                  </Routes>
                </ErrorBoundary>
              </div>
            </AuthGuard>
          </BrowserRouter>
        </AnalyticsProvider>
      </QueryClient>
    </ThemeProvider>
  );
}

export default App;
