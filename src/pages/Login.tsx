
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, LogIn, KeyRound, MailCheck, Github, Linkedin, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { logAuditEvent } from '@/services/auditService';
import { sanitizeData } from '@/services/auditService';
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { isRateLimited, generateCsrfToken, sanitizeInput } from '@/utils/securityUtils';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  rememberMe: z.boolean().optional(),
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
  const [csrfToken, setCsrfToken] = useState('');
  const [securityWarning, setSecurityWarning] = useState<string | null>(null);
  
  // Generate CSRF token on component mount
  useEffect(() => {
    const token = generateCsrfToken();
    setCsrfToken(token);
    sessionStorage.setItem('csrfToken', token);
    
    // Check for suspicious activity
    const userAgent = navigator.userAgent;
    const knownBots = ['semrush', 'ahrefsbot', 'baiduspider', 'yandex', 'mj12bot'];
    
    if (knownBots.some(bot => userAgent.toLowerCase().includes(bot))) {
      setSecurityWarning('Suspicious user agent detected. If you are a legitimate user, please continue.');
      logAuditEvent({
        action: 'view_sensitive',
        resource: 'access_control',
        description: 'Suspicious user agent detected on login page',
        severity: 'medium',
        metadata: { userAgent }
      });
    }
    
    // Check if the page is loaded in an iframe (potential clickjacking)
    if (window.self !== window.top) {
      setSecurityWarning('This login page is embedded in an iframe, which is a potential security risk.');
      logAuditEvent({
        action: 'view_sensitive',
        resource: 'access_control',
        description: 'Login page loaded in iframe (potential clickjacking)',
        severity: 'high'
      });
    }
  }, []);
  
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
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    // Sanitize user input
    const sanitizedEmail = sanitizeInput(data.email);
    
    // Check for rate limiting
    if (isRateLimited(`login_${sanitizedEmail}`, 5, 15 * 60 * 1000)) {
      toast.error("Too Many Attempts", {
        description: "Please try again later or reset your password.",
      });
      
      logAuditEvent({
        action: 'login',
        resource: 'user',
        description: 'Rate-limited login attempt',
        metadata: { email: sanitizeData(sanitizedEmail) },
        severity: 'high'
      });
      
      return;
    }
    
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
        metadata: { email: sanitizeData(sanitizedEmail) },
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
        toast("Verification code sent", {
          description: "Please check your email for the verification code.",
          icon: <MailCheck className="h-4 w-4" />
        });
        
        // Log MFA request
        logAuditEvent({
          action: 'mfa_verify',
          resource: 'user',
          description: 'MFA verification requested during login',
          metadata: { email: sanitizeData(sanitizedEmail) },
          severity: 'medium'
        });
        
        return;
      }
      
      // Regular login flow without MFA
      await login(sanitizedEmail, data.password);
      
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
            email: sanitizeData(sanitizedEmail),
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

  const handleSocialLogin = async (provider: 'github' | 'linkedin') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      // Log the social login attempt
      logAuditEvent({
        action: 'login',
        resource: 'user',
        description: `User initiated ${provider} login`,
        severity: 'low'
      });
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.error("Login failed", {
        description: error.message || `Could not sign in with ${provider}. Please try again.`,
      });
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
          <h2 className="text-2xl font-semibold text-primary">Strategic Intelligence Platform</h2>
          <p className="mt-2 text-muted-foreground">Log in to your account</p>
        </div>

        {securityWarning && (
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md flex gap-2 items-center">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300">{securityWarning}</p>
          </div>
        )}

        {!isMfaRequired ? (
          <>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <input type="hidden" name="csrfToken" value={csrfToken} />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          {...field} 
                          autoComplete="email"
                        />
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
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          {...field} 
                          autoComplete="current-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="rememberMe" 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                        <label
                          htmlFor="rememberMe"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Remember me
                        </label>
                      </div>
                    )}
                  />
                  
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
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => handleSocialLogin('github')}
              >
                <Github className="h-4 w-4" />
                GitHub
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center gap-2"
                onClick={() => handleSocialLogin('linkedin')}
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            </div>
          </>
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
        
        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>By logging in, you agree to our <Link to="/terms" className="underline">Terms of Service</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
