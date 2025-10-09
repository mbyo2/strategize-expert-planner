
/**
 * Security check result interface
 */
interface SecurityCheckResult {
  isSecure: boolean;
  reason?: string;
  severity: 'low' | 'medium' | 'high';
}

/**
 * Perform iframe security checks
 */
export const performIframeSecurityCheck = (): SecurityCheckResult => {
  // Check if we're in an iframe
  if (window.self !== window.top) {
    // Check if it's a trusted environment
    if (isTrustedEnvironment()) {
      return {
        isSecure: true,
        severity: 'low'
      };
    }
    
    return {
      isSecure: false,
      reason: 'Application loaded in iframe from untrusted domain. This may be a security risk.',
      severity: 'high'
    };
  }
  
  return {
    isSecure: true,
    severity: 'low'
  };
};

/**
 * Check if we're in a trusted environment
 */
export const isTrustedEnvironment = (): boolean => {
  const trustedDomains = [
    'lovable.app',
    'localhost',
    '127.0.0.1'
  ];
  
  try {
    const parentDomain = window.top?.location.hostname;
    return trustedDomains.some(domain => 
      parentDomain?.includes(domain) || window.location.hostname.includes(domain)
    );
  } catch (e) {
    // Cross-origin access blocked
    return false;
  }
};

/**
 * Attempt to break out of iframe
 */
export const breakOutOfIframe = (): void => {
  try {
    if (window.top && window.self !== window.top) {
      window.top.location.href = window.self.location.href;
    }
  } catch (e) {
    // Cross-origin access blocked, which is expected
    console.warn('Cannot break out of iframe due to cross-origin restrictions');
  }
};

/**
 * Add frame busting script
 */
export const addFrameBustingScript = (): void => {
  // Only add if not already in trusted environment
  if (!isTrustedEnvironment() && window.self !== window.top) {
    const script = document.createElement('script');
    script.textContent = `
      try {
        if (window.top !== window.self) {
          window.top.location = window.self.location;
        }
      } catch (e) {
        // Silently fail if cross-origin
      }
    `;
    document.head.appendChild(script);
  }
};
