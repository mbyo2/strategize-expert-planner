
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { SimpleAuthProvider } from './hooks/useSimpleAuth'
import { OrganizationProvider } from './contexts/OrganizationContext'
import { LanguageProvider } from './i18n/LanguageProvider'
import { IntlProvider } from './i18n/IntlProvider'

// Wrap top-level app with IntlProvider for internationalization utilities
// Note: StrictMode removed to prevent duplicate real-time subscriptions in development
ReactDOM.createRoot(document.getElementById('root')!).render(
  <LanguageProvider>
    <IntlProvider>
      <SimpleAuthProvider>
        <OrganizationProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </OrganizationProvider>
      </SimpleAuthProvider>
    </IntlProvider>
  </LanguageProvider>,
)
