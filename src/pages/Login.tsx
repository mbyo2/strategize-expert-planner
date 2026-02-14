import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn, UserPlus, TestTube, Sparkles, AlertCircle, Globe } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';
import TestUserLogin from '@/components/TestUserLogin';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { useLanguage } from '@/i18n/LanguageProvider';

const Login = () => {
  const { signIn, signUp, isAuthenticated, isLoading } = useSimpleAuth();
  const { t, currentLanguage, rtl, changeLanguage, languageNames } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [consentChecked, setConsentChecked] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  useEffect(() => {
    document.body.dir = rtl ? 'rtl' : 'ltr';
    return () => { document.body.dir = 'ltr'; };
  }, [rtl]);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateLoginForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!loginData.email) errors.email = t('login.email') + ' is required';
    else if (!validateEmail(loginData.email)) errors.email = 'Please enter a valid email';
    if (!loginData.password) errors.password = t('login.password') + ' is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateSignupForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!signupData.name.trim()) errors.name = 'Name is required';
    if (!signupData.email) errors.email = 'Email is required';
    else if (!validateEmail(signupData.email)) errors.email = 'Please enter a valid email';
    if (!signupData.password) errors.password = 'Password is required';
    else if (signupData.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (signupData.password !== signupData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    if (!validateLoginForm()) return;
    setIsSubmitting(true);
    try {
      await signIn({ email: loginData.email, password: loginData.password });
    } catch (error: any) {
      setFormErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    if (!consentChecked) { toast.error('Please accept the Privacy Policy and Terms to continue.'); return; }
    if (!validateSignupForm()) return;
    setIsSubmitting(true);
    try {
      await signUp({ name: signupData.name, email: signupData.email, password: signupData.password });
      toast.success('Account created! Please check your email for verification.');
    } catch (error: any) {
      setFormErrors({ general: error.message || 'Signup failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-md space-y-6">
        {/* Language Switcher */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              className="text-xs border rounded-md px-2 py-1 bg-background text-foreground focus:ring-2 focus:ring-ring"
              value={currentLanguage}
              onChange={e => changeLanguage(e.target.value as typeof currentLanguage)}
              aria-label={t('settings.language')}
            >
              {Object.entries(languageNames).map(([lang, label]) => (
                <option key={lang} value={lang}>{label as string}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t('app.title')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('login.description')}</p>
          </div>
        </div>

        {/* Error */}
        {formErrors.general && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formErrors.general}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setFormErrors({}); }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login" className="gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              {t('login.signIn')}
            </TabsTrigger>
            <TabsTrigger value="signup" className="gap-1.5">
              <UserPlus className="h-3.5 w-3.5" />
              {t('login.signup')}
            </TabsTrigger>
            <TabsTrigger value="test" className="gap-1.5">
              <TestTube className="h-3.5 w-3.5" />
              {t('login.testUsers')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t('login.signIn')}</CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('login.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@company.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      className={formErrors.email ? 'border-destructive' : ''}
                    />
                    {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('login.password')}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className={formErrors.password ? 'border-destructive pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formErrors.password && <p className="text-xs text-destructive">{formErrors.password}</p>}
                  </div>
                  <div className="flex justify-end">
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline no-underline">
                      {t('login.forgot')}
                    </Link>
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in...' : t('login.signIn')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t('login.createAccount')}</CardTitle>
                <CardDescription>Create your account to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">{t('login.fullName')}</Label>
                    <Input
                      id="signup-name"
                      placeholder="John Doe"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className={formErrors.name ? 'border-destructive' : ''}
                    />
                    {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('login.email')}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="name@company.com"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className={formErrors.email ? 'border-destructive' : ''}
                    />
                    {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('login.password')}</Label>
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      className={formErrors.password ? 'border-destructive' : ''}
                    />
                    {formErrors.password && <p className="text-xs text-destructive">{formErrors.password}</p>}
                    {signupData.password && <PasswordStrengthIndicator password={signupData.password} />}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">{t('login.confirmPassword')}</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      className={formErrors.confirmPassword ? 'border-destructive' : ''}
                    />
                    {formErrors.confirmPassword && <p className="text-xs text-destructive">{formErrors.confirmPassword}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting || !consentChecked}>
                    {isSubmitting ? 'Creating account...' : t('login.createAccount')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">{t('login.testUsers')}</CardTitle>
                <CardDescription>
                  Quick login with test accounts. If login fails, visit{' '}
                  <Link to="/test-setup" className="text-primary hover:underline font-medium">/test-setup</Link>{' '}
                  first to create the accounts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TestUserLogin />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Consent */}
        <div className="flex items-start gap-2.5 px-1">
          <input
            id="consent"
            type="checkbox"
            checked={consentChecked}
            onChange={(e) => setConsentChecked(e.target.checked)}
            className="mt-1 rounded border-input"
          />
          <label htmlFor="consent" className="text-xs text-muted-foreground leading-relaxed">
            I agree to the{' '}
            <a href="https://www.intantiko.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline no-underline">
              Privacy Policy
            </a>
            {' '}and{' '}
            <a href="https://www.intantiko.com/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline no-underline">
              Terms of Service
            </a>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Login;
