
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
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
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
    </LanguageProvider>
  </React.StrictMode>,
)
