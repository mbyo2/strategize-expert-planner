
import React from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';

const locales = {
  en: { privacy: 'https://www.intantiko.com/privacy', terms: 'https://www.intantiko.com/terms' },
  es: { privacy: 'https://www.intantiko.com/es/privacy', terms: 'https://www.intantiko.com/es/terms' },
  ar: { privacy: 'https://www.intantiko.com/ar/privacy', terms: 'https://www.intantiko.com/ar/terms' },
  fr: { privacy: 'https://www.intantiko.com/fr/privacy', terms: 'https://www.intantiko.com/fr/terms'},
  de: { privacy: 'https://www.intantiko.com/de/privacy', terms: 'https://www.intantiko.com/de/terms'},
  zh: { privacy: 'https://www.intantiko.com/zh/privacy', terms: 'https://www.intantiko.com/zh/terms'},
  ja: { privacy: 'https://www.intantiko.com/ja/privacy', terms: 'https://www.intantiko.com/ja/terms'},
  ko: { privacy: 'https://www.intantiko.com/ko/privacy', terms: 'https://www.intantiko.com/ko/terms'},
  pt: { privacy: 'https://www.intantiko.com/pt/privacy', terms: 'https://www.intantiko.com/pt/terms'},
  ru: { privacy: 'https://www.intantiko.com/ru/privacy', terms: 'https://www.intantiko.com/ru/terms'},
};
const fallbackLocale = { privacy: 'https://www.intantiko.com/privacy', terms: 'https://www.intantiko.com/terms' };

const LegalLinksInternational: React.FC = () => {
  const { currentLanguage, t, rtl } = useLanguage();
  const links = locales[currentLanguage as keyof typeof locales] || fallbackLocale;

  return (
    <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-2 text-xs text-muted-foreground" dir={rtl ? 'rtl' : 'ltr'}>
      <a href={links.privacy} className="hover:underline" target="_blank" rel="noopener noreferrer" tabIndex={0}>
        {t('legal.privacyPolicy')}
      </a>
      <span className="mx-2 hidden md:inline">|</span>
      <a href={links.terms} className="hover:underline" target="_blank" rel="noopener noreferrer" tabIndex={0}>
        {t('legal.termsOfService')}
      </a>
    </div>
  );
};
export default LegalLinksInternational;
