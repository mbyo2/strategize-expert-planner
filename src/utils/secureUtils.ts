// Enhanced security utilities with proper implementations

// Rate limiting storage with secure cleanup
const rateLimitStore = new Map<string, { count: number; firstAttempt: number }>();

/**
 * Check if a request is rate limited
 */
export const isRateLimited = (key: string, maxAttempts: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record) {
    rateLimitStore.set(key, { count: 1, firstAttempt: now });
    return false;
  }
  
  // Reset if window has expired
  if (now - record.firstAttempt > windowMs) {
    rateLimitStore.set(key, { count: 1, firstAttempt: now });
    return false;
  }
  
  // Increment count
  record.count++;
  
  return record.count > maxAttempts;
};

/**
 * Generate a CSRF token using Web Crypto API
 */
export const generateCsrfToken = async (): Promise<string> => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Sanitize input to prevent XSS with comprehensive protection
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#x60;')
    .replace(/=/g, '&#x3D;');
};

/**
 * Validate password strength with comprehensive checks
 */
export const validatePasswordStrength = (password: string): { valid: boolean; reason?: string; score: number } => {
  let score = 0;
  
  if (password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters long', score: 0 };
  }
  score += 1;
  
  if (password.length >= 12) score += 1;
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one uppercase letter', score };
  }
  score += 1;
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one lowercase letter', score };
  }
  score += 1;
  
  if (!/\d/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one number', score };
  }
  score += 1;
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one special character', score };
  }
  score += 1;
  
  // Check for common patterns
  const commonPatterns = [
    /(.)\1{2,}/,        // Repeated characters
    /123456|654321/,     // Sequential numbers
    /qwerty|asdfgh/,     // Keyboard patterns
    /password|admin/i    // Common words
  ];
  
  if (commonPatterns.some(pattern => pattern.test(password))) {
    return { valid: false, reason: 'Password contains common patterns', score: Math.max(score - 2, 0) };
  }
  
  return { valid: true, score };
};

/**
 * Validate email format with comprehensive checks
 */
export const validateEmail = (email: string): { valid: boolean; reason?: string } => {
  // RFC 5322 compliant regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!email) {
    return { valid: false, reason: 'Email is required' };
  }
  
  if (email.length > 254) {
    return { valid: false, reason: 'Email is too long' };
  }
  
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }
  
  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\.\./,           // Double dots
    /^\.|\.$/ ,       // Starting or ending with dot
    /@\.|\.$@/        // Dot adjacent to @
  ];
  
  if (suspiciousPatterns.some(pattern => pattern.test(email))) {
    return { valid: false, reason: 'Email contains invalid patterns' };
  }
  
  return { valid: true };
};

/**
 * Enhanced SQL injection detection
 */
export const detectSqlInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /UNION(?:\s+ALL)?\s+SELECT/i,
    /INSERT\s+INTO/i,
    /DELETE\s+FROM/i,
    /UPDATE.+SET/i,
    /DROP\s+(TABLE|DATABASE)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Check if connection is secure (HTTPS)
 */
export const isSecureConnection = (): boolean => {
  return window.location.protocol === 'https:' || 
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

/**
 * Redact sensitive data from strings for logging
 */
export const redactSensitiveData = (data: string): string => {
  const sensitivePatterns = [
    { pattern: /password=([^&\s]+)/gi, replacement: 'password=***' },
    { pattern: /token=([^&\s]+)/gi, replacement: 'token=***' },
    { pattern: /key=([^&\s]+)/gi, replacement: 'key=***' },
    { pattern: /secret=([^&\s]+)/gi, replacement: 'secret=***' },
    { pattern: /authorization:\s*bearer\s+([^\s]+)/gi, replacement: 'authorization: bearer ***' },
    { pattern: /(\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4})/g, replacement: '****-****-****-****' },
    { pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '***@***.***' }
  ];
  
  let redactedData = data;
  sensitivePatterns.forEach(({ pattern, replacement }) => {
    redactedData = redactedData.replace(pattern, replacement);
  });
  
  return redactedData;
};

/**
 * Content Security Policy violation handler
 */
export const handleCSPViolation = (event: SecurityPolicyViolationEvent) => {
  const violation = {
    blockedURI: event.blockedURI,
    violatedDirective: event.violatedDirective,
    originalPolicy: event.originalPolicy,
    documentURI: event.documentURI,
    lineNumber: event.lineNumber
  };
  
  console.warn('CSP Violation:', violation);
  
  // Note: Audit logging would be handled by the calling component
  console.warn('CSP Violation details:', violation);
};

/**
 * Setup Content Security Policy violation monitoring
 */
export const setupCSPMonitoring = () => {
  document.addEventListener('securitypolicyviolation', handleCSPViolation);
};

/**
 * Clean up rate limiting storage periodically
 */
export const cleanupRateLimitStorage = () => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  for (const [key, record] of rateLimitStore.entries()) {
    if (now - record.firstAttempt > oneHour) {
      rateLimitStore.delete(key);
    }
  }
};

// Set up periodic cleanup
if (typeof window !== 'undefined') {
  setInterval(cleanupRateLimitStorage, 15 * 60 * 1000); // Every 15 minutes
  setupCSPMonitoring();
}