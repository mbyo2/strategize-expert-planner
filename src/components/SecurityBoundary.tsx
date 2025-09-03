import React, { useEffect } from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { logAuditEvent } from '@/services/auditService';
import { toast } from 'sonner';

interface SecurityBoundaryProps {
  children: React.ReactNode;
}

const SecurityBoundary: React.FC<SecurityBoundaryProps> = ({ children }) => {
  const { isAuthenticated, user } = useUnifiedAuth();

  useEffect(() => {
    // Set up security monitoring
    const handleSecurityViolation = (event: SecurityPolicyViolationEvent) => {
      logAuditEvent({
        action: 'unauthorized_access',
        resource: 'security_setting',
        description: `CSP violation: ${event.violatedDirective}`,
        metadata: {
          blockedURI: event.blockedURI,
          violatedDirective: event.violatedDirective,
          sourceFile: event.sourceFile
        },
        severity: 'high'
      });
    };

    // Monitor for suspicious console activity
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;

    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('password') || message.includes('token') || message.includes('secret')) {
        logAuditEvent({
          action: 'view_sensitive',
          resource: 'security_setting',
          description: 'Potential sensitive data logged to console',
          severity: 'medium'
        });
      }
      originalConsoleLog.apply(console, args);
    };

    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('Unauthorized') || message.includes('403') || message.includes('401')) {
        logAuditEvent({
          action: 'unauthorized_access',
          resource: 'security_setting',
          description: 'Authentication error detected',
          severity: 'high'
        });
      }
      originalConsoleError.apply(console, args);
    };

    // Add CSP violation listener
    document.addEventListener('securitypolicyviolation', handleSecurityViolation);

    return () => {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      document.removeEventListener('securitypolicyviolation', handleSecurityViolation);
    };
  }, []);

  // Check for inactive sessions
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkSessionTimeout = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      const maxInactivity = 30 * 60 * 1000; // 30 minutes

      if (lastActivity && Date.now() - parseInt(lastActivity) > maxInactivity) {
        toast.error('Session expired due to inactivity');
        logAuditEvent({
          action: 'logout',
          resource: 'user',
          description: 'Automatic logout due to session timeout',
          severity: 'medium'
        });
        // Force logout
        window.location.href = '/login';
      }
    };

    const interval = setInterval(checkSessionTimeout, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Track user activity
  useEffect(() => {
    if (!isAuthenticated) return;

    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, [isAuthenticated]);

  return <>{children}</>;
};

export default SecurityBoundary;