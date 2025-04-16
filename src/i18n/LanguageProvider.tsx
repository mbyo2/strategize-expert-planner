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
  
  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    if (isLoading) return key; // Return key if translations are still loading
    
    let translatedText = translations[key] || key;
    
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
    },
    es: {
      'app.title': 'Intantiko',
      'dashboard.title': 'Panel de Control',
      'industry.title': 'Análisis de la Industria',
      'planning.title': 'Planificación Estratégica',
      'goals.title': 'Objetivos',
      'resources.title': 'Recursos',
      'settings.title': 'Configuración',
      'profile.title': 'Perfil',
      'login.title': 'Iniciar Sesión',
      'signup.title': 'Registrarse',
      'welcome.message': 'Bienvenido a Intantiko',
      'settings.language': 'Idioma',
      'settings.theme': 'Tema',
      'navigation.home': 'Inicio',
      'navigation.analytics': 'Análisis',
      'button.save': 'Guardar',
      'button.cancel': 'Cancelar',
      'button.edit': 'Editar',
      'button.delete': 'Eliminar',
      'feedback.title': 'Valoramos tu opinión',
      'help.center': 'Centro de Ayuda',
      'accessibility.title': 'Opciones de Accesibilidad',
      'accessibility.fontSize': 'Tamaño del Texto',
      'accessibility.highContrast': 'Modo de Alto Contraste',
    },
    // For brevity, other languages will use English as fallback
    fr: {
      'app.title': 'Intantiko',
      'dashboard.title': 'Tableau de Bord',
      'industry.title': 'Analyse de l\'Industrie',
      'planning.title': 'Planification Stratégique',
      'goals.title': 'Objectifs',
      'resources.title': 'Ressources',
      'settings.title': 'Paramètres',
      'welcome.message': 'Bienvenue à Intantiko',
    },
    de: {
      'app.title': 'Intantiko',
      'dashboard.title': 'Dashboard',
      'industry.title': 'Branchenanalyse',
      'planning.title': 'Strategische Planung',
      'goals.title': 'Ziele',
      'welcome.message': 'Willkommen bei Intantiko',
    },
    // Other languages would have their own translations
    zh: { 'app.title': 'Intantiko', 'welcome.message': '欢迎使用 Intantiko' },
    ja: { 'app.title': 'Intantiko', 'welcome.message': 'Intantikoへようこそ' },
    ko: { 'app.title': 'Intantiko', 'welcome.message': 'Intantiko에 오신 것을 환영합니다' },
    pt: { 'app.title': 'Intantiko', 'welcome.message': 'Bem-vindo ao Intantiko' },
    ru: { 'app.title': 'Intantiko', 'welcome.message': 'Добро пожаловать в Intantiko' },
    ar: { 'app.title': 'Intantiko', 'welcome.message': 'مرحبًا بك في Intantiko', 'dashboard.title': 'لوحة المعلومات' },
  };
  
  return translations[language] || translations.en;
}
