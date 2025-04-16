
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
import { sanitizeData } from '@/services/auditService';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();
  const [isMfaRequired, setIsMfaRequired] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [isProcessingMfa, setIsProcessingMfa] = useState(false);
  const [loginData, setLoginData] = useState<LoginFormValues | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  
  // Check if there's a session expiry message in the location state
  useEffect(() => {
    if (location.state?.sessionExpired) {
      toast.warning("Session Expired", {
        description: "Your session has expired. Please log in again.",
      });
      
      // Clean up the location state
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);
  
  // Redirect to home or intended page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      
      // If the user needs MFA, redirect to MFA verification
      if (user?.mfaEnabled && !user?.mfaVerified) {
        navigate('/mfa-verify', { state: { from } });
        return;
      }
      
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location, user]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Check if account is locked
    if (lockedUntil && new Date() < lockedUntil) {
      const remainingMinutes = Math.ceil(
        (lockedUntil.getTime() - new Date().getTime()) / (1000 * 60)
      );
      
      toast.error("Account Locked", {
        description: `Too many failed attempts. Try again in ${remainingMinutes} minutes.`,
      });
      
      // Log locked account attempt
      logAuditEvent({
        action: 'login',
        resource: 'user',
        description: 'Login attempt on locked account',
        metadata: { email: sanitizeData(data.email) },
        severity: 'high'
      });
      
      return;
    }
    
    try {
      // Store login data for MFA verification
      setLoginData(data);
      
      // Check if user has MFA enabled
      const { data: mfaData } = await supabase.auth.getUser();
      const mfaEnabled = mfaData?.user?.user_metadata?.mfa_enabled;
      
      if (mfaEnabled) {
        setIsMfaRequired(true);
        
        // Send OTP code to the user's email
        // In a real app, we would do this on the backend
        toast("Verification code sent", {
          description: "Please check your email for the verification code.",
          icon: <MailCheck className="h-4 w-4" />
        });
        
        // Log MFA request
        logAuditEvent({
          action: 'mfa_verify',
          resource: 'user',
          description: 'MFA verification requested during login',
          metadata: { email: sanitizeData(data.email) },
          severity: 'medium'
        });
        
        return;
      }
      
      // Regular login flow without MFA
      await login(data.email, data.password);
      
      // Reset login attempts on success
      setLoginAttempts(0);
      
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
      
      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      // Lock account after 5 failed attempts
      if (newAttempts >= 5) {
        const lockTime = new Date();
        lockTime.setMinutes(lockTime.getMinutes() + 15); // Lock for 15 minutes
        setLockedUntil(lockTime);
        
        toast.error("Account Locked", {
          description: "Too many failed attempts. Try again in 15 minutes.",
        });
        
        // Log account lock
        logAuditEvent({
          action: 'login',
          resource: 'user',
          description: 'Account locked due to too many failed login attempts',
          metadata: { 
            email: sanitizeData(data.email),
            attemptsCount: newAttempts,
            lockedUntil: lockTime.toISOString()
          },
          severity: 'high'
        });
      } else {
        toast.error("Login failed", {
          description: error.message || "Invalid email or password. Please try again.",
        });
      }
      
      // Log the failed login
      logAuditEvent({
        action: 'login',
        resource: 'user',
        description: 'Failed login attempt',
        metadata: { 
          error: error.message,
          attemptsCount: newAttempts
        },
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
      toast.error("Verification failed", {
        description: error.message || "Invalid verification code. Please try again.",
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

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || (lockedUntil && new Date() < lockedUntil)}>
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
              
              {lockedUntil && new Date() < lockedUntil && (
                <p className="text-sm text-destructive text-center">
                  Account locked until {lockedUntil.toLocaleTimeString()} due to too many failed attempts.
                </p>
              )}
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
