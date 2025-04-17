
/**
 * Security utilities to protect against common web vulnerabilities
 */

/**
 * Generate a random CSRF token
 * @returns A random string to use as CSRF token
 */
export const generateCsrfToken = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate a CSRF token
 * @param token The token to validate
 * @param storedToken The stored token to compare against
 * @returns Whether the token is valid
 */
export const validateCsrfToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && !!token;
};

/**
 * Sanitize user input to prevent XSS
 * @param input String to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Rate limit function based on local storage
 * @param key Identifier for the rate limit
 * @param maxAttempts Maximum attempts allowed
 * @param windowMs Time window in milliseconds
 * @returns Whether the action should be allowed or is rate limited
 */
export const isRateLimited = (key: string, maxAttempts = 5, windowMs = 60000): boolean => {
  const now = Date.now();
  const storageKey = `rateLimit_${key}`;
  
  try {
    // Get existing attempts from storage
    const storedData = localStorage.getItem(storageKey);
    let attempts: {timestamp: number}[] = storedData ? JSON.parse(storedData) : [];
    
    // Filter out attempts outside the time window
    attempts = attempts.filter(attempt => now - attempt.timestamp < windowMs);
    
    // If too many attempts, rate limit
    if (attempts.length >= maxAttempts) {
      return true;
    }
    
    // Add current attempt and store
    attempts.push({ timestamp: now });
    localStorage.setItem(storageKey, JSON.stringify(attempts));
    
    return false;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return false; // Default to allowing on error
  }
};

/**
 * Validate a password against security requirements
 * @param password The password to validate
 * @returns Object with validation result and reason
 */
export const validatePasswordStrength = (password: string): { valid: boolean; reason?: string } => {
  if (password.length < 8) {
    return { valid: false, reason: 'Password must be at least 8 characters long' };
  }
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  
  if (!hasUppercase) {
    return { valid: false, reason: 'Password must contain at least one uppercase letter' };
  }
  
  if (!hasLowercase) {
    return { valid: false, reason: 'Password must contain at least one lowercase letter' };
  }
  
  if (!hasNumber) {
    return { valid: false, reason: 'Password must contain at least one number' };
  }
  
  if (!hasSpecial) {
    return { valid: false, reason: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
};
