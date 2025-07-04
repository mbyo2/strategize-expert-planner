
import React, { useState, useEffect, useRef } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, LogIn, UserPlus, TestTube, Globe, AlertCircle } from 'lucide-react';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';
import TestUserLogin from '@/components/TestUserLogin';
import PasswordStrengthIndicator from '@/components/PasswordStrengthIndicator';
import { useLanguage } from '@/i18n/LanguageProvider';
import LegalLinksInternational from '@/components/LegalLinksInternational';
import { useIntl } from '@/i18n/IntlProvider';

// Polyfill: List of common IANA timezones
const TIMEZONE_LIST = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Toronto',
  'America/Sao_Paulo', 'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
  'Europe/Rome', 'Europe/Moscow', 'Asia/Tokyo', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Singapore',
  'Asia/Dubai', 'Asia/Kolkata', 'Australia/Sydney', 'Australia/Melbourne', 'Africa/Johannesburg',
  'Africa/Lagos', 'Pacific/Auckland', 'Pacific/Honolulu'
];

const getTimezones = () => TIMEZONE_LIST;

const Login = () => {
  const { signIn, signUp, isAuthenticated, isLoading } = useSimpleAuth();
  const { t, currentLanguage, rtl, changeLanguage, languageNames } = useLanguage();
  const { formatDate, formatNumber, formatCurrency, locale } = useIntl();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Accessibility: Consent required for login/signup
  const [consentChecked, setConsentChecked] = useState(false);

  // Explicit selectable timezone
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const timezones = getTimezones();

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

  // Ref for timezone select for a11y focus
  const timezoneRef = useRef<HTMLSelectElement | null>(null);

  // Focus outline when dropdown is used
  useEffect(() => {
    const tzEl = timezoneRef.current;
    if (tzEl) {
      const handleFocus = () => tzEl.classList.add('ring-2', 'ring-primary');
      const handleBlur = () => tzEl.classList.remove('ring-2', 'ring-primary');
      tzEl.addEventListener('focus', handleFocus);
      tzEl.addEventListener('blur', handleBlur);
      return () => {
        tzEl.removeEventListener('focus', handleFocus);
        tzEl.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateSignupForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!signupData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!signupData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(signupData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!signupData.password) {
      errors.password = 'Password is required';
    } else if (!validatePassword(signupData.password)) {
      errors.password = 'Password must be at least 6 characters long';
    }

    if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateLoginForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!loginData.email) {
      errors.email = 'Email is required';
    } else if (!validateEmail(loginData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!loginData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!consentChecked) {
      toast.error('You must agree to the legal terms before continuing.');
      return;
    }

    if (!validateLoginForm()) {
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
      setFormErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    if (!consentChecked) {
      toast.error('You must agree to the legal terms before continuing.');
      return;
    }

    if (!validateSignupForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await signUp({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password
      });
      toast.success('Account created successfully! Please check your email for verification.');
    } catch (error: any) {
      console.error('Signup error:', error);
      setFormErrors({ general: error.message || 'Signup failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Locale-aware display updates ---
  const dateNow = new Date();
  const formattedDate = formatDate(dateNow, {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: selectedTimezone,
  });
  const formattedNumber = formatNumber(1234567.89);
  const formattedCurrency = formatCurrency(123.45, "USD");

  // --- GMT offset for selected timezone ---
  const getGmtOffset = (tz: string) => {
    try {
      const dateStr = dateNow.toLocaleString('en-US', { timeZone: tz });
      const dateInTZ = new Date(dateStr);
      const diff = (dateInTZ.getTime() - dateNow.getTime()) / (1000 * 60);
      const hours = Math.floor(diff / 60);
      const mins = Math.abs(Math.round(diff % 60));
      const sign = hours >= 0 ? "+" : "-";
      return `GMT${sign}${String(Math.abs(hours)).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
    } catch {
      return "GMT";
    }
  };
  const gmtOffset = getGmtOffset(selectedTimezone);

  // --- RTL layout adaptation ---
  useEffect(() => {
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
        {/* Language Switcher */}
        <div className="flex flex-row items-center justify-end gap-2 mt-2" aria-label={t('settings.language')}>
          <Globe className="h-4 w-4 text-muted-foreground" />
          <label htmlFor="language-select" className="sr-only">{t('settings.language')}</label>
          <select
            id="language-select"
            className="px-2 py-1 border rounded text-xs bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary"
            style={{ minWidth: 80, zIndex: 50 }}
            value={currentLanguage}
            onChange={e => changeLanguage(e.target.value as typeof currentLanguage)}
            aria-label={t('settings.language')}
          >
            {Object.entries(languageNames).map(([lang, label]) => (
              <option key={lang} value={lang}>{label}</option>
            ))}
          </select>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold" aria-label="App Title">{t('app.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('login.description')}</p>
        </div>

        <div className="w-full text-xs text-center mt-2 flex flex-col items-center space-y-1">
          <label htmlFor="timezone-select" className="sr-only">{t('timezone.timezone')}</label>
          <div className="flex items-center gap-2">
            <select
              ref={timezoneRef}
              id="timezone-select"
              className="border rounded px-2 py-1 text-xs focus:ring-2 focus:ring-primary focus:outline-none bg-white dark:bg-gray-800"
              style={{ zIndex: 30, minWidth: 160 }}
              value={selectedTimezone}
              onChange={e => setSelectedTimezone(e.target.value)}
              aria-label={t('timezone.timezone')}
              tabIndex={0}
            >
              {timezones.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
            <span className="ml-2">{t('timezone.current')}: <b>{formattedDate}</b></span>
          </div>
          <span>{t('timezone.timezone')}: <b>{selectedTimezone}</b></span>
          <span>{t('timezone.gmtOffset')}: <b>{gmtOffset}</b></span>
          <span>
            {t('login.exampleNumber') || "Example Number"}: <b>{formattedNumber}</b>
            {" | "}
            {t('login.exampleCurrency') || "Example Currency"}: <b>{formattedCurrency}</b>
          </span>
        </div>

        <div className="w-full my-2">
          <div className="text-muted-foreground text-xs text-center bg-accent rounded px-2 py-1" role="alert">
            {t('compliance.notice')}
          </div>
        </div>

        {/* Consent/Legal acknowledgement */}
        <div className="flex items-center gap-2 px-2 py-2">
          <input
            id="consent-checkbox"
            type="checkbox"
            checked={consentChecked}
            onChange={e => setConsentChecked(e.target.checked)}
            className="border rounded focus:ring-2 focus:ring-primary"
            aria-label={t('legal.acknowledge') ||
              "I acknowledge and agree to the Privacy Policy and Terms of Service."}
            aria-checked={consentChecked}
            tabIndex={0}
          />
          <label htmlFor="consent-checkbox" className="text-xs">
            {t('legal.acknowledge') ||
              "I acknowledge and agree to the Privacy Policy and Terms of Service."}{' '}
            <a
              href="https://www.intantiko.com/privacy"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={0}
              aria-label={t('legal.privacyPolicy')}
            >
              {t('legal.privacyPolicy')}
            </a>{" "}
            &bull;{" "}
            <a
              href="https://www.intantiko.com/terms"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={0}
              aria-label={t('legal.termsOfService')}
            >
              {t('legal.termsOfService')}
            </a>
          </label>
        </div>

        {/* General error display */}
        {formErrors.general && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formErrors.general}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                <form onSubmit={handleLogin} className="space-y-4" dir={rtl ? 'rtl' : 'ltr'} aria-label="Sign In form">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('login.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('login.email')}
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                      aria-required="true"
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-600">{formErrors.email}</p>
                    )}
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
                        aria-required="true"
                        aria-label={t('login.password')}
                        className={formErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? t('login.hidePassword') : t('login.showPassword')}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        tabIndex={0}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {formErrors.password && (
                      <p className="text-sm text-red-600">{formErrors.password}</p>
                    )}
                  </div>
                  <div className={rtl ? 'text-left' : 'text-right'}>
                    <Link 
                      to="/forgot-password" 
                      className="text-sm text-primary hover:underline"
                    >
                      {t('login.forgot')}
                    </Link>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !consentChecked} 
                    aria-disabled={!consentChecked}
                  >
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
                <form onSubmit={handleSignup} className="space-y-4" dir={rtl ? 'rtl' : 'ltr'} aria-label="Sign Up form">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('login.fullName')}</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('login.fullName')}
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      required
                      aria-required="true"
                      className={formErrors.name ? 'border-red-500' : ''}
                    />
                    {formErrors.name && (
                      <p className="text-sm text-red-600">{formErrors.name}</p>
                    )}
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
                      aria-required="true"
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-600">{formErrors.email}</p>
                    )}
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
                      aria-required="true"
                      className={formErrors.password ? 'border-red-500' : ''}
                    />
                    {formErrors.password && (
                      <p className="text-sm text-red-600">{formErrors.password}</p>
                    )}
                    <PasswordStrengthIndicator password={signupData.password} />
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
                      aria-required="true"
                      className={formErrors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-sm text-red-600">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || !consentChecked} 
                    aria-disabled={!consentChecked}
                  >
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
