
// Rate limiting storage
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
 * Generate a CSRF token
 */
export const generateCsrfToken = (): string => {
  return crypto.randomUUID();
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate password strength
 */
export const validatePasswordStrength = (password: string): { valid: boolean; reason?: string } => {
  if (password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { valid: false, reason: 'Password must contain at least one number' };
  }
  
  return { valid: true };
};

/**
 * Validate email format
 */
export const validateEmail = (email: string): { valid: boolean; reason?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }
  
  return { valid: true };
};

/**
 * Detect potential SQL injection attempts
 */
export const detectSqlInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Check if connection is secure (HTTPS)
 */
export const isSecureConnection = (): boolean => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};
