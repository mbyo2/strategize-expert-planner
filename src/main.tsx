
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { SimpleAuthProvider } from './hooks/useSimpleAuth'
import { LanguageProvider } from './i18n/LanguageProvider'
import { IntlProvider } from './i18n/IntlProvider'

// Wrap top-level app with IntlProvider for internationalization utilities
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <IntlProvider>
        <SimpleAuthProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </SimpleAuthProvider>
      </IntlProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
