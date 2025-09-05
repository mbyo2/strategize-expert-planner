import { Helmet } from 'react-helmet-async';

/**
 * Secure Headers component that sets proper security headers
 * Note: These are meta tags and won't work in all environments
 * For production, these should be set at the server level
 */
const SecureHeaders: React.FC = () => {
  return (
    <Helmet>
      {/* Content Security Policy - Hardened for Security */}
      <meta 
        httpEquiv="Content-Security-Policy" 
        content="
          default-src 'self';
          script-src 'self' 'nonce-{SCRIPT_NONCE}' https://api.qrserver.com https://cdn.jsdelivr.net;
          style-src 'self' 'nonce-{STYLE_NONCE}' https://fonts.googleapis.com;
          font-src 'self' data: https://fonts.gstatic.com;
          img-src 'self' data: blob: https: http://localhost:*;
          connect-src 'self' https: wss: ws://localhost:* https://api.dicebear.com https://ublzhmimdynqzqsdicyn.supabase.co;
          frame-src 'none';
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          frame-ancestors 'none';
          upgrade-insecure-requests;
          block-all-mixed-content;
        " 
      />
      
      {/* Prevent MIME type sniffing */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      
      {/* Enable XSS filtering */}
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      
      {/* Control referrer information */}
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* Prevent clickjacking - Hardened */}
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      
      {/* Control DNS prefetching */}
      <meta httpEquiv="x-dns-prefetch-control" content="off" />
      
      {/* Strict Transport Security (HSTS) */}
      <meta httpEquiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains" />
      
      {/* Permissions Policy */}
      <meta 
        httpEquiv="Permissions-Policy" 
        content="
          camera=(),
          microphone=(),
          geolocation=(),
          interest-cohort=(),
          payment=(),
          usb=(),
          magnetometer=(),
          accelerometer=(),
          gyroscope=(),
          fullscreen=(self)
        " 
      />
    </Helmet>
  );
};

export default SecureHeaders;