
import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, LogIn, KeyRound, MailCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { logAuditEvent } from '@/services/auditService';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [isMfaRequired, setIsMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isProcessingMfa, setIsProcessingMfa] = useState(false);
  const [loginData, setLoginData] = useState<LoginFormValues | null>(null);
  
  // Redirect to home or intended page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      // Store login data for MFA verification
      setLoginData(data);
      
      // Normally we would check if MFA is required for this user
      // For this example, we'll simulate MFA being required 50% of the time
      const requireMfa = Math.random() > 0.5;
      
      if (requireMfa) {
        setIsMfaRequired(true);
        // In a real app, we would send a verification code to the user's email/phone
        toast("Verification code sent", {
          description: "Please check your email for the verification code.",
          icon: <MailCheck className="h-4 w-4" />
        });
        return;
      }
      
      // Regular login flow without MFA
      await login(data.email, data.password);
      
      // Check if email is verified
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email_confirmed_at === null) {
        toast("Email not verified", {
          description: "Please check your email to verify your account.",
        });
        return;
      }

      const from = location.state?.from?.pathname || '/';
      
      toast("Login successful", {
        description: "Welcome back!",
      });
      
      // Log the successful login
      logAuditEvent({
        action: 'login',
        resource: 'user',
        resourceId: user?.id,
        description: 'User logged in successfully',
        userId: user?.id,
        severity: 'low'
      });
      
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login error:", error);
      toast("Login failed", {
        description: error.message || "Invalid email or password. Please try again.",
        style: { backgroundColor: 'red', color: 'white' }
      });
      
      // Log the failed login
      logAuditEvent({
        action: 'login',
        resource: 'user',
        description: 'Failed login attempt',
        metadata: { error: error.message },
        severity: 'medium'
      });
    }
  };

  const handleVerifyMfa = async () => {
    if (!loginData) return;
    
    setIsProcessingMfa(true);
    
    try {
      // In a real app, we would validate the MFA code here
      // For this example, we'll accept "123456" as a valid code
      if (mfaCode !== "123456") {
        throw new Error("Invalid verification code");
      }
      
      // Proceed with login
      await login(loginData.email, loginData.password);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const from = location.state?.from?.pathname || '/';
      
      toast("Login successful", {
        description: "Your identity has been verified.",
      });
      
      // Log the successful MFA login
      logAuditEvent({
        action: 'login',
        resource: 'user',
        resourceId: user?.id,
        description: 'User logged in with MFA',
        userId: user?.id,
        severity: 'low',
        metadata: { usedMfa: true }
      });
      
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("MFA verification error:", error);
      toast("Verification failed", {
        description: error.message || "Invalid verification code. Please try again.",
        style: { backgroundColor: 'red', color: 'white' }
      });
      
      // Log the failed MFA attempt
      logAuditEvent({
        action: 'login',
        resource: 'user',
        description: 'Failed MFA verification attempt',
        metadata: { error: error.message },
        severity: 'high'
      });
    } finally {
      setIsProcessingMfa(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="mt-2 text-3xl font-bold">Intantiko</h1>
          <p className="mt-2 text-muted-foreground">Log in to your account</p>
        </div>

        {!isMfaRequired ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Logging in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Log in
                  </span>
                )}
              </Button>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <div className="rounded-lg border p-4 bg-muted/50">
              <h2 className="text-lg font-medium mb-2">Two-Factor Authentication</h2>
              <p className="text-sm text-muted-foreground mb-4">
                For added security, please enter the verification code sent to your email.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="mfa-code" className="text-sm font-medium">
                    Verification Code
                  </label>
                  <Input 
                    id="mfa-code"
                    type="text" 
                    value={mfaCode} 
                    onChange={(e) => setMfaCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="text-center tracking-widest text-lg"
                  />
                  <p className="text-xs text-muted-foreground">
                    For this demo, use code: 123456
                  </p>
                </div>
                
                <Button 
                  onClick={handleVerifyMfa} 
                  className="w-full" 
                  disabled={isProcessingMfa || mfaCode.length !== 6}
                >
                  {isProcessingMfa ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <KeyRound className="h-4 w-4" />
                      Verify
                    </span>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setIsMfaRequired(false)}
                >
                  Back to Login
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
