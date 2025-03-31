
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import Industry from "./pages/Industry";
import Planning from "./pages/Planning";
import Goals from "./pages/Goals";
import Resources from "./pages/Resources";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Intantiko - Strategic Planning Software
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected routes */}
            <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
            <Route path="/industry" element={<AuthGuard requiredRoles={['analyst', 'manager', 'admin']}><Industry /></AuthGuard>} />
            <Route path="/planning" element={<AuthGuard requiredRoles={['manager', 'admin']}><Planning /></AuthGuard>} />
            <Route path="/goals" element={<AuthGuard><Goals /></AuthGuard>} />
            <Route path="/resources" element={<AuthGuard requiredRoles={['analyst', 'manager', 'admin']}><Resources /></AuthGuard>} />
            <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
            <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
