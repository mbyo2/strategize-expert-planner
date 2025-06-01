
import React, { createContext, useContext, useCallback } from 'react';
import { SimpleSecurity } from '@/utils/simpleSecurity';
import { toast } from 'sonner';

interface RateLimitContextType {
  checkRateLimit: (key: string, maxAttempts?: number, windowMinutes?: number) => boolean;
  sanitizeInput: (input: string) => string;
  validateEmail: (email: string) => { valid: boolean; reason?: string };
  validatePassword: (password: string) => { valid: boolean; reason?: string };
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

export const RateLimitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const checkRateLimit = useCallback((
    key: string, 
    maxAttempts: number = 5, 
    windowMinutes: number = 15
  ): boolean => {
    const isLimited = SimpleSecurity.isRateLimited(key, maxAttempts, windowMinutes);
    
    if (isLimited) {
      toast.error(`Too many attempts. Please wait ${windowMinutes} minutes before trying again.`);
      
      // Log security event
      SimpleSecurity.logSecurityEvent(
        'rate_limit_exceeded',
        `Rate limit exceeded for key: ${key}`,
        undefined,
        { key, maxAttempts, windowMinutes }
      );
    }
    
    return isLimited;
  }, []);

  const sanitizeInput = useCallback((input: string): string => {
    return SimpleSecurity.sanitize(input);
  }, []);

  const validateEmail = useCallback((email: string) => {
    return SimpleSecurity.validateEmail(email);
  }, []);

  const validatePassword = useCallback((password: string) => {
    return SimpleSecurity.validatePassword(password);
  }, []);

  const value: RateLimitContextType = {
    checkRateLimit,
    sanitizeInput,
    validateEmail,
    validatePassword
  };

  return (
    <RateLimitContext.Provider value={value}>
      {children}
    </RateLimitContext.Provider>
  );
};

export const useRateLimit = () => {
  const context = useContext(RateLimitContext);
  if (!context) {
    throw new Error('useRateLimit must be used within a RateLimitProvider');
  }
  return context;
};
