
import { logAuditEvent } from '@/services/auditService';

// Rate limiting cache
const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

export class SimpleSecurity {
  /**
   * Basic input sanitization to prevent XSS
   */
  static sanitize(input: string): string {
    if (!input) return input;
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Simple rate limiting
   */
  static isRateLimited(
    key: string, 
    maxAttempts: number = 5, 
    windowMinutes: number = 15
  ): boolean {
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;
    
    const cached = rateLimitCache.get(key);
    
    if (!cached || now > cached.resetTime) {
      // Reset or create new entry
      rateLimitCache.set(key, { count: 1, resetTime: now + windowMs });
      return false;
    }
    
    if (cached.count >= maxAttempts) {
      return true;
    }
    
    // Increment count
    cached.count++;
    return false;
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): { valid: boolean; reason?: string } {
    if (password.length < 8) {
      return { valid: false, reason: 'Password must be at least 8 characters long' };
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecial) {
      return { 
        valid: false, 
        reason: 'Password must contain uppercase, lowercase, number, and special character' 
      };
    }
    
    return { valid: true };
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): { valid: boolean; reason?: string } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return { valid: false, reason: 'Invalid email format' };
    }
    
    return { valid: true };
  }

  /**
   * Log security events with automatic severity detection
   */
  static async logSecurityEvent(
    action: string,
    description: string,
    userId?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    // Auto-detect severity based on action
    let severity: 'low' | 'medium' | 'high' = 'low';
    
    const highSeverityActions = ['login_failed', 'suspicious_activity', 'unauthorized_access'];
    const mediumSeverityActions = ['login', 'logout', 'password_reset'];
    
    if (highSeverityActions.some(a => action.includes(a))) {
      severity = 'high';
    } else if (mediumSeverityActions.some(a => action.includes(a))) {
      severity = 'medium';
    }

    await logAuditEvent({
      action: action as any,
      resource: 'user',
      description,
      userId,
      severity,
      metadata
    });
  }

  /**
   * Check if running in secure environment
   */
  static isSecureEnvironment(): boolean {
    return window.location.protocol === 'https:' || 
           window.location.hostname === 'localhost' ||
           window.location.hostname.includes('lovable.app');
  }

  /**
   * Generate secure random token
   */
  static generateToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Clean up rate limit cache periodically
   */
  static cleanupRateLimit(): void {
    const now = Date.now();
    for (const [key, value] of rateLimitCache.entries()) {
      if (now > value.resetTime) {
        rateLimitCache.delete(key);
      }
    }
  }
}

// Auto-cleanup rate limit cache every 5 minutes
setInterval(() => SimpleSecurity.cleanupRateLimit(), 5 * 60 * 1000);
