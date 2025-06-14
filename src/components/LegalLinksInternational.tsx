
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
    <nav
      className="mt-6 flex flex-col md:flex-row items-center justify-center gap-2 text-xs text-muted-foreground"
      dir={rtl ? 'rtl' : 'ltr'}
      aria-label={t('legal.privacyPolicy') + ' & ' + t('legal.termsOfService')}
    >
      <a href={links.privacy} className="hover:underline focus:ring-2 focus:ring-primary focus:outline-none" target="_blank" rel="noopener noreferrer" tabIndex={0} aria-label={t('legal.privacyPolicy')}>
        {t('legal.privacyPolicy')}
      </a>
      <span className="mx-2 hidden md:inline" aria-hidden="true">|</span>
      <a href={links.terms} className="hover:underline focus:ring-2 focus:ring-primary focus:outline-none" target="_blank" rel="noopener noreferrer" tabIndex={0} aria-label={t('legal.termsOfService')}>
        {t('legal.termsOfService')}
      </a>
    </nav>
  );
};
export default LegalLinksInternational;
