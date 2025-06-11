
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SimpleAuthProvider } from "@/hooks/useSimpleAuth";
import SimpleAuthGuard from "@/components/SimpleAuthGuard";

// Import pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import TestSetup from "./pages/TestSetup";
import Goals from "./pages/Goals";
import Planning from "./pages/Planning";
import Industry from "./pages/Industry";
import Analytics from "./pages/Analytics";
import Teams from "./pages/Teams";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Resources from "./pages/Resources";
import Infrastructure from "./pages/Infrastructure";
import Organization from "./pages/Organization";
import AccessDenied from "./pages/AccessDenied";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SimpleAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/access-denied" element={<AccessDenied />} />
              
              {/* Test setup route - accessible without auth for initial setup */}
              <Route path="/test-setup" element={<TestSetup />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <SimpleAuthGuard>
                  <Index />
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
              
              <Route path="/industry" element={
                <SimpleAuthGuard>
                  <Industry />
                </SimpleAuthGuard>
              } />

              <Route path="/resources" element={
                <SimpleAuthGuard>
                  <Resources />
                </SimpleAuthGuard>
              } />
              
              <Route path="/infrastructure" element={
                <SimpleAuthGuard requiredRole="admin">
                  <Infrastructure />
                </SimpleAuthGuard>
              } />
              
              <Route path="/organization" element={
                <SimpleAuthGuard requiredRole="manager">
                  <Organization />
                </SimpleAuthGuard>
              } />
              
              <Route path="/analytics" element={
                <SimpleAuthGuard requiredRole="analyst">
                  <Analytics />
                </SimpleAuthGuard>
              } />
              
              <Route path="/teams" element={
                <SimpleAuthGuard requiredRole="manager">
                  <Teams />
                </SimpleAuthGuard>
              } />
              
              <Route path="/settings" element={
                <SimpleAuthGuard>
                  <Settings />
                </SimpleAuthGuard>
              } />
              
              <Route path="/profile" element={
                <SimpleAuthGuard>
                  <Profile />
                </SimpleAuthGuard>
              } />
              
              <Route path="/admin" element={
                <SimpleAuthGuard requiredRole="admin">
                  <Admin />
                </SimpleAuthGuard>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TooltipProvider>
        </SimpleAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
