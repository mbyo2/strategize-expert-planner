
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

/**
 * Component to add security headers to the application
 * Helps protect against common web vulnerabilities
 */
const SecurityHeaders: React.FC = () => {
  useEffect(() => {
    // Add global security properties
    if (window.document) {
      // Disable features that could be exploited
      (document as any).requestStorageAccess = undefined;
    }
  }, []);

  // Check if we're in a development/preview environment
  const isLovablePreview = window.location.hostname.includes('lovable.app');
  
  // Adjust CSP for preview environments
  const cspContent = isLovablePreview
    ? "default-src 'self'; script-src 'self' 'unsafe-inline' https://storage.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.dicebear.com; connect-src 'self' https://ublzhmimdynqzqsdicyn.supabase.co wss://ublzhmimdynqzqsdicyn.supabase.co; frame-ancestors 'self' https://*.lovable.app; object-src 'none'; base-uri 'self';"
    : "default-src 'self'; script-src 'self' 'unsafe-inline' https://storage.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://api.dicebear.com; connect-src 'self' https://ublzhmimdynqzqsdicyn.supabase.co wss://ublzhmimdynqzqsdicyn.supabase.co; frame-ancestors 'none'; object-src 'none'; base-uri 'self';";

  // Adjust X-Frame-Options for preview environments  
  const xFrameOptions = isLovablePreview ? "SAMEORIGIN" : "DENY";

  return (
    <Helmet>
      {/* Content Security Policy */}
      <meta
        http-equiv="Content-Security-Policy"
        content={cspContent}
      />
      
      {/* Prevent MIME sniffing attacks */}
      <meta 
        http-equiv="X-Content-Type-Options" 
        content="nosniff" 
      />
      
      {/* Disable loading in frame (anti-clickjacking) */}
      <meta 
        http-equiv="X-Frame-Options" 
        content={xFrameOptions}
      />
      
      {/* XSS protection as an extra layer of defense */}
      <meta 
        http-equiv="X-XSS-Protection" 
        content="1; mode=block" 
      />
      
      {/* Prevent caching sensitive information */}
      <meta 
        http-equiv="Cache-Control" 
        content="private, no-cache, no-store, must-revalidate" 
      />
      
      {/* Force HTTPS */}
      <meta 
        http-equiv="Strict-Transport-Security" 
        content="max-age=31536000; includeSubDomains; preload" 
      />
      
      {/* Referrer policy */}
      <meta 
        name="referrer" 
        content="strict-origin-when-cross-origin" 
      />
      
      {/* Access control policy */}
      <meta 
        http-equiv="Permissions-Policy" 
        content="camera=(), microphone=(), geolocation=(), interest-cohort=()" 
      />
    </Helmet>
  );
};

export default SecurityHeaders;
