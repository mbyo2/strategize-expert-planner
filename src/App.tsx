
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from "@/components/theme-provider"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
import SimpleAuthGuard from '@/components/SimpleAuthGuard';
import SEO from '@/components/SEO';
import SecurityHeaders from '@/components/SecurityHeaders';
import ErrorBoundary from '@/components/ErrorBoundary';
import { SimpleAuthProvider } from '@/hooks/useSimpleAuth';
import { AnalyticsProvider } from '@/contexts/AnalyticsContext';
import Integrations from "@/pages/Integrations";

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <QueryClientProvider client={queryClient}>
          <SimpleAuthProvider>
            <AnalyticsProvider>
              <BrowserRouter>
                <div className="min-h-screen bg-background">
                  <SEO />
                  <SecurityHeaders />
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/" element={
                        <SimpleAuthGuard>
                          <Dashboard />
                        </SimpleAuthGuard>
                      } />
                      <Route path="/goals" element={
                        <SimpleAuthGuard>
                          <Goals />
                        </SimpleAuthGuard>
                      } />
                      <Route path="/planning" element={
                        <SimpleAuthGuard>
                          <Planning />
                        </SimpleAuthGuard>
                      } />
                      <Route path="/analytics" element={
                        <SimpleAuthGuard>
                          <Analytics />
                        </SimpleAuthGuard>
                      } />
                      <Route path="/industry" element={
                        <SimpleAuthGuard>
                          <Industry />
                        </SimpleAuthGuard>
                      } />
                      <Route path="/teams" element={
                        <SimpleAuthGuard>
                          <Teams />
                        </SimpleAuthGuard>
                      } />
                      <Route path="/profile" element={
                        <SimpleAuthGuard>
                          <Profile />
                        </SimpleAuthGuard>
                      } />
                      <Route path="/settings" element={
                        <SimpleAuthGuard>
                          <Settings />
                        </SimpleAuthGuard>
                      } />
                      <Route path="/admin" element={
                        <SimpleAuthGuard requiredRole="admin">
                          <Admin />
                        </SimpleAuthGuard>
                      } />
                      <Route path="/integrations" element={
                        <SimpleAuthGuard>
                          <Integrations />
                        </SimpleAuthGuard>
                      } />
                      <Route path="/404" element={<NotFound />} />
                      <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                  </ErrorBoundary>
                </div>
              </BrowserRouter>
            </AnalyticsProvider>
          </SimpleAuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
