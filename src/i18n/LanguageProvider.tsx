import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

type Language = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'pt' | 'ru' | 'ar';

interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  rtl: boolean;
  languageNames: Record<Language, string>;
}

const availableLanguages: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  pt: 'Português',
  ru: 'Русский',
  ar: 'العربية'
};

const rtlLanguages: Language[] = ['ar'];

// Create the language context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [currentLanguage, setCurrentLanguage] = useLocalStorage<Language>('app-language', 'en');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine if current language is RTL
  const rtl = rtlLanguages.includes(currentLanguage);
  
  // Load translations for the current language
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would actually fetch from a translations file
        // For this demo, we'll just use a mock implementation
        const mockTranslations = getMockTranslations(currentLanguage);
        setTranslations(mockTranslations);
      } catch (error) {
        console.error('Failed to load translations', error);
        // Fallback to English if loading fails
        setTranslations(getMockTranslations('en'));
      } finally {
        setIsLoading(false);
      }
      
      // Set document language and direction attributes
      document.documentElement.lang = currentLanguage;
      document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    };
    
    loadTranslations();
  }, [currentLanguage, rtl]);
  
  // Translation function with fallback message for missing translations
  const t = (key: string, params?: Record<string, string>): string => {
    if (isLoading) return key; // Return key if translations are still loading
    
    let translatedText = translations[key];
    if (!translatedText) {
      // Fallback: show clear warning in dev, show key in production
      if (process.env.NODE_ENV === "development") {
        return `[MISSING I18N: ${key}]`;
      }
      return key;
    }

    // Replace parameters in the translated text if provided
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translatedText = translatedText.replace(`{{${paramKey}}}`, paramValue);
      });
    }
    
    return translatedText;
  };
  
  // Change language function
  const changeLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };
  
  return (
    <LanguageContext.Provider 
      value={{ 
        currentLanguage, 
        changeLanguage, 
        t, 
        rtl,
        languageNames: availableLanguages
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook for using the language context
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Mock translations for demonstration
function getMockTranslations(language: Language): Record<string, string> {
  const translations: Record<Language, Record<string, string>> = {
    en: {
      'app.title': 'Intantiko',
      'dashboard.title': 'Dashboard',
      'industry.title': 'Industry Analysis',
      'planning.title': 'Strategic Planning',
      'goals.title': 'Goals',
      'resources.title': 'Resources',
      'settings.title': 'Settings',
      'profile.title': 'Profile',
      'login.title': 'Log In',
      'signup.title': 'Sign Up',
      'welcome.message': 'Welcome to Intantiko',
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'navigation.home': 'Home',
      'navigation.analytics': 'Analytics',
      'button.save': 'Save',
      'button.cancel': 'Cancel',
      'button.edit': 'Edit',
      'button.delete': 'Delete',
      'feedback.title': 'We value your feedback',
      'help.center': 'Help Center',
      'accessibility.title': 'Accessibility Options',
      'accessibility.fontSize': 'Text Size',
      'accessibility.highContrast': 'High Contrast Mode',
      'login.description': 'Sign in to access your strategic planning tools',
      'login.email': 'Email',
      'login.password': 'Password',
      'login.showPassword': 'Show password',
      'login.hidePassword': 'Hide password',
      'login.forgot': 'Forgot password?',
      'login.signIn': 'Sign In',
      'login.signup': 'Sign Up',
      'login.createAccount': 'Create Account',
      'login.fullName': 'Full Name',
      'login.confirmPassword': 'Confirm Password',
      'login.passwordMinLength': 'Password must be at least 6 characters',
      'login.allFieldsRequired': 'Please fill in all fields',
      'login.passwordMismatch': 'Passwords do not match',
      'login.creatingAccount': 'Creating account...',
      'login.signingIn': 'Signing in...',
      'login.or': 'or',
      'login.testUsers': 'Test Users',
      'login.testUsersDesc': 'Quick login with pre-configured test users',
      'login.needTestUsers': 'Need to create test users? Go to Test Setup →',
      'legal.privacyPolicy': 'Privacy Policy',
      'legal.termsOfService': 'Terms of Service',
      'compliance.notice': 'By continuing, you acknowledge your data may be stored and processed in accordance with applicable international privacy laws including GDPR and CCPA.',
      'timezone.current': 'Current time',
      'timezone.timezone': 'Your timezone',
      'timezone.gmtOffset': 'GMT offset',
    },
    es: {
      'app.title': 'Intantiko',
      'dashboard.title': 'Panel de Control',
      'login.description': 'Inicia sesión para acceder a herramientas de planificación',
      'login.email': 'Correo electrónico',
      'login.password': 'Contraseña',
      'login.showPassword': 'Mostrar contraseña',
      'login.hidePassword': 'Ocultar contraseña',
      'login.forgot': '¿Olvidaste la contraseña?',
      'login.signIn': 'Iniciar sesión',
      'login.signup': 'Registrarse',
      'login.createAccount': 'Crear cuenta',
      'login.fullName': 'Nombre completo',
      'login.confirmPassword': 'Confirmar contraseña',
      'login.passwordMinLength': 'La contraseña debe tener al menos 6 caracteres',
      'login.allFieldsRequired': 'Por favor completa todos los campos',
      'login.passwordMismatch': 'Las contraseñas no coinciden',
      'login.creatingAccount': 'Creando cuenta...',
      'login.signingIn': 'Iniciando sesión...',
      'login.or': 'o',
      'login.testUsers': 'Usuarios de Prueba',
      'login.testUsersDesc': 'Acceso rápido con usuarios de prueba',
      'login.needTestUsers': '¿Necesitas crear usuarios de prueba? Ve a Test Setup →',
      'legal.privacyPolicy': 'Política de Privacidad',
      'legal.termsOfService': 'Términos del Servicio',
      'compliance.notice': 'Al continuar, reconoces que tus datos pueden almacenarse y procesarse conforme a leyes internacionales de privacidad como el GDPR y la CCPA.',
      'timezone.current': 'Hora actual',
      'timezone.timezone': 'Tu zona horaria',
      'timezone.gmtOffset': 'Desfase GMT',
    },
    ar: {
      'app.title': 'إنتانيتيكو',
      'dashboard.title': 'لوحة المعلومات',
      'login.description': 'سجّل الدخول للوصول إلى أدوات التخطيط الاستراتيجي',
      'login.email': 'البريد الإلكتروني',
      'login.password': 'كلمة المرور',
      'login.showPassword': 'إظهار كلمة المرور',
      'login.hidePassword': 'إخفاء كلمة المرور',
      'login.forgot': 'هل نسيت كلمة المرور؟',
      'login.signIn': 'تسجيل الدخول',
      'login.signup': 'إنشاء حساب',
      'login.createAccount': 'أنشئ حسابًا',
      'login.fullName': 'الاسم الكامل',
      'login.confirmPassword': 'تأكيد كلمة المرور',
      'login.passwordMinLength': 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
      'login.allFieldsRequired': 'يرجى تعبئة جميع الحقول',
      'login.passwordMismatch': 'كلمات المرور غير متطابقة',
      'login.creatingAccount': 'يتم إنشاء الحساب...',
      'login.signingIn': 'يتم تسجيل الدخول...',
      'login.or': 'أو',
      'login.testUsers': 'مستخدمون للاختبار',
      'login.testUsersDesc': 'تسجيل دخول سريع بمستخدمين جاهزين',
      'login.needTestUsers': 'تريد إنشاء مستخدمين للاختبار؟ انتقل لإعداد الاختبار →',
      'legal.privacyPolicy': 'سياسة الخصوصية',
      'legal.termsOfService': 'شروط الخدمة',
      'compliance.notice': 'بالمتابعة، فإنك تقر بأن بياناتك قد يتم تخزينها ومعالجتها وفقًا لقوانين الخصوصية الدولية مثل GDPR وCCPA.',
      'timezone.current': 'الوقت الحالي',
      'timezone.timezone': 'منطقتك الزمنية',
      'timezone.gmtOffset': 'فرق توقيت غرينتش',
    },
    fr: {
      'app.title': 'Intantiko',
      'dashboard.title': 'Tableau de bord',
      'login.description': 'Connectez-vous pour accéder à vos outils de planification stratégique',
      'login.email': 'Adresse e-mail',
      'login.password': 'Mot de passe',
      'legal.privacyPolicy': 'Politique de Confidentialité',
      'legal.termsOfService': 'Conditions d\'Utilisation',
      'compliance.notice': 'En continuant, vous reconnaissez que vos données peuvent être stockées et traitées conformément aux lois internationales de confidentialité comme le RGPD et la CCPA.',
      'login.signIn': 'Se connecter',
      'login.signup': 'Inscription',
      'login.createAccount': 'Créer un compte',
      'login.fullName': 'Nom complet',
      'login.confirmPassword': 'Confirmez le mot de passe',
    },
    de: {},
    zh: { 'app.title': 'Intantiko', 'welcome.message': '欢迎使用 Intantiko' },
    ja: { 'app.title': 'Intantiko', 'welcome.message': 'Intantikoへようこそ' },
    ko: { 'app.title': 'Intantiko', 'welcome.message': 'Intantiko에 오신 것을 환영합니다' },
    pt: { 'app.title': 'Intantiko', 'welcome.message': 'Bem-vindo ao Intantiko' },
    ru: { 'app.title': 'Intantiko', 'welcome.message': 'Добро пожаловать в Intantiko' },
  };
  
  return translations[language] || translations.en;
}
