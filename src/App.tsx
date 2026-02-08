import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import QueryClient from './QueryClient';
import SEO from './components/SEO';
import SecureHeaders from './components/security/SecureHeaders';
import SecurityBoundary from './components/SecurityBoundary';
import SimpleAuthGuard from '@/components/SimpleAuthGuard';
import AppLayout from '@/components/AppLayout';

import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import SecurePasswordReset from '@/components/security/SecurePasswordReset';
import AccessDenied from '@/pages/AccessDenied';
import MfaVerify from '@/pages/MfaVerify';
import NotFound from '@/pages/NotFound';

import Dashboard from '@/pages/Dashboard';
import Goals from '@/pages/Goals';
import Planning from '@/pages/Planning';
import Teams from '@/pages/Teams';
import Analytics from '@/pages/Analytics';
import Industry from '@/pages/Industry';
import Organization from '@/pages/Organization';
import OrganizationManagement from '@/pages/OrganizationManagement';
import UserManagement from '@/pages/UserManagement';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Admin from '@/pages/Admin';
import Resources from '@/pages/Resources';
import Integrations from '@/pages/Integrations';
import AIOperations from '@/pages/AIOperations';
import DataFoundry from '@/pages/DataFoundry';
import Infrastructure from '@/pages/Infrastructure';
import TacticalMap from '@/pages/TacticalMap';
import Support from '@/pages/Support';
import ERP from '@/pages/ERP';
import TestSetup from '@/pages/TestSetup';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <HelmetProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Toaster />
            <SEO />
            <SecureHeaders />
            <SecurityBoundary>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/auth/callback" element={<SecurePasswordReset />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="/mfa-verify" element={<MfaVerify />} />

                {/* Protected routes with sidebar layout */}
                <Route element={<SimpleAuthGuard><AppLayout /></SimpleAuthGuard>}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/goals" element={<Goals />} />
                  <Route path="/planning" element={<Planning />} />
                  <Route path="/teams" element={<Teams />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/industry" element={<Industry />} />
                  <Route path="/organization" element={<Organization />} />
                  <Route path="/organization-management" element={<OrganizationManagement />} />
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/integrations" element={<Integrations />} />
                  <Route path="/ai-operations" element={<AIOperations />} />
                  <Route path="/data-foundry" element={<DataFoundry />} />
                  <Route path="/infrastructure" element={<Infrastructure />} />
                  <Route path="/erp" element={<ERP />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/test-setup" element={<TestSetup />} />
                  <Route path="/tactical-map" element={<TacticalMap />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SecurityBoundary>
          </ThemeProvider>
        </HelmetProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
