
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

/**
 * Detect potential SQL injection patterns
 * @param input The input string to check
 * @returns Whether SQL injection patterns are detected
 */
export const detectSqlInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /(\bUNION\b|\bOR\b|\bAND\b).*(\b1\s*=\s*1\b|\b1\s*=\s*0\b)/i,
    /('|\"|`|;|--|\*|\||&)/,
    /(\bexec\b|\bexecute\b|\bsp_\b|\bxp_\b)/i
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
};

/**
 * Validate email format and detect suspicious patterns
 * @param email The email to validate
 * @returns Validation result
 */
export const validateEmail = (email: string): { valid: boolean; reason?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, reason: 'Invalid email format' };
  }
  
  // Check for suspicious patterns
  if (detectSqlInjection(email)) {
    return { valid: false, reason: 'Email contains suspicious characters' };
  }
  
  // Check for common disposable email domains
  const disposableDomains = ['10minutemail.com', 'tempmail.org', 'guerrillamail.com'];
  const domain = email.split('@')[1].toLowerCase();
  
  if (disposableDomains.includes(domain)) {
    return { valid: false, reason: 'Disposable email addresses are not allowed' };
  }
  
  return { valid: true };
};

/**
 * Generate a secure session token
 * @returns A cryptographically secure random token
 */
export const generateSecureToken = (): string => {
  const array = new Uint8Array(64);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Check if the current environment is secure (HTTPS)
 * @returns Whether the connection is secure
 */
export const isSecureConnection = (): boolean => {
  return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
};

/**
 * Validate file uploads for security
 * @param file The file to validate
 * @returns Validation result
 */
export const validateFileUpload = (file: File): { valid: boolean; reason?: string } => {
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, reason: 'File size exceeds 10MB limit' };
  }
  
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain'];
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, reason: 'File type not allowed' };
  }
  
  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'];
  const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, reason: 'File extension not allowed' };
  }
  
  return { valid: true };
};

/**
 * Hash a password client-side before sending to server
 * @param password The password to hash
 * @returns Promise that resolves to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};
