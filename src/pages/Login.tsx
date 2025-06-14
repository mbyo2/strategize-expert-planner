import React, { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, LogIn, UserPlus, TestTube } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';
import TestUserLogin from '@/components/TestUserLogin';
import { useLanguage } from '@/i18n/LanguageProvider';
import LegalLinksInternational from '@/components/LegalLinksInternational';

const Login = () => {
  const { signIn, signUp, isAuthenticated, isLoading } = useSimpleAuth();
  const { t, currentLanguage, rtl } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Signup form state
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await signIn({
        email: loginData.email,
        password: loginData.password
      });
    } catch (error: any) {
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (signupData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password
      });
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- TimeZone/Locale utilities ---
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = currentLanguage || navigator.language;
  const dateNow = new Date();
  const formattedDate = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeStyle: 'short' }).format(dateNow);
  const gmtOffset = (() => {
    const offset = dateNow.getTimezoneOffset();
    const hours = Math.floor(Math.abs(offset) / 60);
    const mins = Math.abs(offset) % 60;
    const sign = offset > 0 ? '-' : '+';
    return `GMT${sign}${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  })();

  // --- RTL layout adaptation ---
  React.useEffect(() => {
    document.body.dir = rtl ? 'rtl' : 'ltr';
    return () => { document.body.dir = 'ltr'; };
  }, [rtl]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={rtl ? 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4' : 'min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4'}>
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">{t('app.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('login.description')}
          </p>
        </div>

        <div className="w-full text-xs text-center mt-2 flex flex-col items-center space-y-1">
          <span>{t('timezone.current')}: <b>{formattedDate}</b></span>
          <span>{t('timezone.timezone')}: <b>{userTimeZone}</b></span>
          <span>{t('timezone.gmtOffset')}: <b>{gmtOffset}</b></span>
        </div>

        <div className="w-full my-2">
          <div className="text-muted-foreground text-xs text-center bg-accent rounded px-2 py-1" role="alert">
            {t('compliance.notice')}
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">{t('login.signIn')}</TabsTrigger>
            <TabsTrigger value="signup">{t('login.signup')}</TabsTrigger>
            <TabsTrigger value="test">{t('login.testUsers')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  {t('login.signIn')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4" dir={rtl ? 'rtl' : 'ltr'}>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('login.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('login.email')}
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t('login.password')}</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder={t('login.password')}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className={rtl ? 'text-left' : 'text-right'}>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:underline"
                    >
                      {t('login.forgot')}
                    </Link>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? t('login.signingIn') : t('login.signIn')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  {t('login.createAccount')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4" dir={rtl ? 'rtl' : 'ltr'}>
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('login.fullName')}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('login.fullName')}
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">{t('login.email')}</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder={t('login.email')}
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">{t('login.password')}</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder={t('login.password')}
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t('login.confirmPassword')}</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder={t('login.confirmPassword')}
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? t('login.creatingAccount') : t('login.createAccount')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  {t('login.testUsers')}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t('login.testUsersDesc')}
                </p>
              </CardHeader>
              <CardContent>
                <TestUserLogin />
                <div className="mt-4 text-center">
                  <Link to="/test-setup" className="text-sm text-primary hover:underline">
                    {t('login.needTestUsers')}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        {/* International Privacy Policy and Terms */}
        <LegalLinksInternational />
      </div>
    </div>
  );
};

export default Login;
