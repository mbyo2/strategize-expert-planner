
/**
 * Enhanced iframe protection utilities to prevent clickjacking attacks
 */

/**
 * Check if the current page is loaded in an iframe
 */
export const isInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch (e) {
    // If we can't access window.top, we're definitely in an iframe
    return true;
  }
};

/**
 * Check if we're in a trusted environment (Lovable preview)
 */
export const isTrustedEnvironment = (): boolean => {
  return window.location.hostname.includes('lovable.app') || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

/**
 * Get the parent frame's origin if accessible
 */
export const getParentOrigin = (): string | null => {
  try {
    if (window.parent && window.parent !== window) {
      return window.parent.location.origin;
    }
  } catch (e) {
    // Cross-origin restrictions prevent access
  }
  return null;
};

/**
 * Comprehensive iframe security check
 */
export const performIframeSecurityCheck = (): {
  isSecure: boolean;
  reason?: string;
  severity: 'low' | 'medium' | 'high';
} => {
  const inIframe = isInIframe();
  const trustedEnv = isTrustedEnvironment();
  
  if (!inIframe) {
    return { isSecure: true, severity: 'low' };
  }
  
  if (trustedEnv) {
    return { isSecure: true, severity: 'low' };
  }
  
  // Check if we can determine the parent origin
  const parentOrigin = getParentOrigin();
  
  if (!parentOrigin) {
    return {
      isSecure: false,
      reason: 'Login page embedded in iframe from unknown origin - potential clickjacking attack',
      severity: 'high'
    };
  }
  
  // Even if we can get the parent origin, embedding login pages is risky
  return {
    isSecure: false,
    reason: `Login page embedded in iframe from ${parentOrigin} - security risk`,
    severity: 'medium'
  };
};

/**
 * Break out of iframe if detected (frame busting)
 */
export const breakOutOfIframe = (): void => {
  if (isInIframe() && !isTrustedEnvironment()) {
    try {
      window.top!.location = window.location.href;
    } catch (e) {
      // If we can't redirect the parent, show a warning
      console.warn('Iframe detected but cannot redirect parent frame');
    }
  }
};

/**
 * Add frame busting script to prevent iframe embedding
 */
export const addFrameBustingScript = (): void => {
  // Create and inject frame busting script
  const script = document.createElement('script');
  script.textContent = `
    (function() {
      if (window.self !== window.top && !window.location.hostname.includes('lovable.app')) {
        try {
          window.top.location = window.location;
        } catch(e) {
          document.body.style.display = 'none';
          alert('This page cannot be displayed in a frame for security reasons.');
        }
      }
    })();
  `;
  document.head.appendChild(script);
};
