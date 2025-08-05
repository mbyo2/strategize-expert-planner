
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import QueryClient from './QueryClient';
import SEO from './components/SEO';
import SecurityHeaders from './components/SecurityHeaders';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Dashboard from '@/pages/Dashboard';
import Goals from '@/pages/Goals';
import Planning from '@/pages/Planning';
import Teams from '@/pages/Teams';
import Analytics from '@/pages/Analytics';
import Industry from '@/pages/Industry';
import Organization from '@/pages/Organization';
import OrganizationManagement from '@/pages/OrganizationManagement';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import Admin from '@/pages/Admin';
import Resources from '@/pages/Resources';
import Integrations from '@/pages/Integrations';
import AIOperations from '@/pages/AIOperations';
import DataFoundry from '@/pages/DataFoundry';
import Infrastructure from '@/pages/Infrastructure';
import TestSetup from '@/pages/TestSetup';
import NotFound from '@/pages/NotFound';
import SimpleAuthGuard from '@/components/SimpleAuthGuard';
import AccessDenied from '@/pages/AccessDenied';
import MfaVerify from '@/pages/MfaVerify';
import TacticalMap from '@/pages/TacticalMap';
import UserManagement from '@/pages/UserManagement';
import Support from '@/pages/Support';
import ERP from '@/pages/ERP';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <HelmetProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Toaster />
            <SEO />
            <SecurityHeaders />
            <div className="min-h-screen bg-background">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/access-denied" element={<AccessDenied />} />
                <Route path="/mfa-verify" element={<MfaVerify />} />
                
                {/* Protected routes */}
                <Route path="/" element={<SimpleAuthGuard><Dashboard /></SimpleAuthGuard>} />
                <Route path="/tactical-map" element={<SimpleAuthGuard><TacticalMap /></SimpleAuthGuard>} />
                <Route path="/goals" element={<SimpleAuthGuard><Goals /></SimpleAuthGuard>} />
                <Route path="/planning" element={<SimpleAuthGuard><Planning /></SimpleAuthGuard>} />
                <Route path="/teams" element={<SimpleAuthGuard><Teams /></SimpleAuthGuard>} />
                <Route path="/analytics" element={<SimpleAuthGuard><Analytics /></SimpleAuthGuard>} />
                <Route path="/industry" element={<SimpleAuthGuard><Industry /></SimpleAuthGuard>} />
                <Route path="/organization" element={<SimpleAuthGuard><Organization /></SimpleAuthGuard>} />
                <Route path="/organization-management" element={<SimpleAuthGuard><OrganizationManagement /></SimpleAuthGuard>} />
                <Route path="/user-management" element={<SimpleAuthGuard><UserManagement /></SimpleAuthGuard>} />
                <Route path="/profile" element={<SimpleAuthGuard><Profile /></SimpleAuthGuard>} />
                <Route path="/settings" element={<SimpleAuthGuard><Settings /></SimpleAuthGuard>} />
                <Route path="/admin" element={<SimpleAuthGuard><Admin /></SimpleAuthGuard>} />
                <Route path="/resources" element={<SimpleAuthGuard><Resources /></SimpleAuthGuard>} />
                <Route path="/integrations" element={<SimpleAuthGuard><Integrations /></SimpleAuthGuard>} />
                <Route path="/ai-operations" element={<SimpleAuthGuard><AIOperations /></SimpleAuthGuard>} />
                <Route path="/data-foundry" element={<SimpleAuthGuard><DataFoundry /></SimpleAuthGuard>} />
                <Route path="/infrastructure" element={<SimpleAuthGuard><Infrastructure /></SimpleAuthGuard>} />
                <Route path="/support" element={<SimpleAuthGuard><Support /></SimpleAuthGuard>} />
                <Route path="/test-setup" element={<SimpleAuthGuard><TestSetup /></SimpleAuthGuard>} />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </ThemeProvider>
        </HelmetProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
