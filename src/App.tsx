
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
import React from 'react';

// Create a QueryClient instance outside component
const queryClient = new QueryClient();

// Make App a proper function component with React.FC type
const App: React.FC = () => {
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
                  {/* Public routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/access-denied" element={<AccessDenied />} />
                  
                  {/* Protected routes */}
                  <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
                  <Route path="/industry" element={<AuthGuard requiredRoles={['analyst', 'manager', 'admin']}><Industry /></AuthGuard>} />
                  <Route path="/planning" element={<AuthGuard requiredRoles={['manager', 'admin']}><Planning /></AuthGuard>} />
                  <Route path="/goals" element={<AuthGuard><Goals /></AuthGuard>} />
                  <Route path="/resources" element={<AuthGuard requiredRoles={['analyst', 'manager', 'admin']}><Resources /></AuthGuard>} />
                  <Route path="/teams" element={<AuthGuard requiredRoles={['manager', 'admin']}><Teams /></AuthGuard>} />
                  <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
                  <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
                  <Route path="/admin" element={<AuthGuard requiredRoles={['admin']}><Admin /></AuthGuard>} />
                  
                  {/* Catch-all route */}
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
