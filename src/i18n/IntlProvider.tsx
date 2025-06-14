
import React, { createContext, useContext, useMemo } from "react";
import { useLanguage } from "@/i18n/LanguageProvider";

// IntlContext type
interface IntlContextType {
  formatDate(date: Date | number, options?: Intl.DateTimeFormatOptions): string;
  formatNumber(num: number, options?: Intl.NumberFormatOptions): string;
  formatCurrency(
    value: number,
    currency?: string,
    options?: Intl.NumberFormatOptions
  ): string;
  currency: string;
  locale: string;
}

const IntlContext = createContext<IntlContextType | undefined>(undefined);

// Helper: choose default currency per language/region
const defaultCurrencyMapping: Record<string, string> = {
  en: "USD",
  es: "EUR",
  ar: "SAR",
  fr: "EUR",
  de: "EUR",
  zh: "CNY",
  ja: "JPY",
  ko: "KRW",
  pt: "BRL",
  ru: "RUB",
};

export const IntlProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentLanguage } = useLanguage();
  // This can later be extended with user-saved preferences
  const locale = currentLanguage || navigator.language || "en";
  const currency =
    defaultCurrencyMapping[currentLanguage] ||
    Intl.NumberFormat(locale, { style: "currency", currency: "USD" })
      .resolvedOptions().currency ||
    "USD";

  const formatDate = (date: Date | number, options?: Intl.DateTimeFormatOptions) => {
    try {
      return new Intl.DateTimeFormat(locale, options || { dateStyle: "medium", timeStyle: "short" }).format(date);
    } catch {
      return String(date);
    }
  };

  const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
    try {
      return new Intl.NumberFormat(locale, options).format(num);
    } catch {
      return String(num);
    }
  };

  const formatCurrency = (
    value: number,
    forcedCurrency?: string,
    options?: Intl.NumberFormatOptions
  ) => {
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: forcedCurrency || currency,
        ...options,
      }).format(value);
    } catch {
      // fallback
      return `${value} ${forcedCurrency || currency}`;
    }
  };

  const value = useMemo(
    () => ({
      formatDate,
      formatNumber,
      formatCurrency,
      currency,
      locale,
    }),
    [locale, currency]
  );

  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>;
};

// Hook: useIntl
export function useIntl(): IntlContextType {
  const context = useContext(IntlContext);
  if (!context) {
    throw new Error("useIntl must be used within an IntlProvider");
  }
  return context;
}

