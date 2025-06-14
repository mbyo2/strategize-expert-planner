
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import { SimpleAuthProvider } from './hooks/useSimpleAuth'
import { LanguageProvider } from './i18n/LanguageProvider'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <SimpleAuthProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </SimpleAuthProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
