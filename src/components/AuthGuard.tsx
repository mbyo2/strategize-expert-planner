import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';
import AccessDenied from '@/pages/AccessDenied';
import { logAuditEvent } from '@/services/auditService';
import { toast } from 'sonner';
import { sanitizeInput } from '@/utils/securityUtils';

// List of IP ranges for IP-based access restrictions
// This would be loaded from a configuration or API in a real app
const RESTRICTED_IP_RANGES: string[] = [];

// Timeout in minutes for automatic session logout
const SESSION_TIMEOUT_MINUTES = 30;

// List of known attack patterns to detect suspicious activities
const SUSPICIOUS_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL Injection attempts
  /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i, // XSS attempts
  /(((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>))/i, // Image XSS attempts
  /((\%3C)|<)[^\n]+((\%3E)|>)/i, // Other XSS attempts
];

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  resourceType?: string;
  resourceId?: string;
  actionType?: 'view' | 'edit' | 'delete' | 'admin';
  requireMfa?: boolean; // New prop for requiring MFA verification
}

// Function to detect suspicious request parameters
const detectSuspiciousActivity = (url: string): boolean => {
  // Check for suspicious patterns
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(url)) {
      return true;
    }
  }
  return false;
};

// Check if we're in the Lovable preview environment
const isLovablePreview = () => {
  return window.location.hostname.includes('lovable.app');
};

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRoles = [],
  resourceType,
  resourceId,
  actionType = 'view',
  requireMfa = false,
}) => {
  const { isAuthenticated, user, hasPermission, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [ipAllowed, setIpAllowed] = useState<boolean>(true);
  const [suspicious, setSuspicious] = useState<boolean>(false);

  // Check for suspicious activity
  useEffect(() => {
    const fullUrl = window.location.href;
    const isSuspicious = detectSuspiciousActivity(fullUrl);
    
    if (isSuspicious) {
      setSuspicious(true);
      
      logAuditEvent({
        action: 'view_sensitive',
        resource: 'access_control',
        description: 'Suspicious access attempt detected',
        userId: user?.id,
        severity: 'high',
        metadata: { url: sanitizeInput(fullUrl) }
      });
      
      toast.error('Security Alert', {
        description: 'Suspicious activity detected. This incident has been logged.',
      });
    }
  }, [location.pathname, location.search, user?.id]);

  // Check IP restriction and session timeout
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check IP restrictions
    const checkIpRestrictions = async () => {
      try {
        // In a real app, we would fetch the client IP from a service
        // For demo purposes, we'll simulate an IP check
        const ipCheckResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipCheckResponse.json();
        const clientIp = ipData.ip;
        
        // Also check if user has specific IP restrictions
        const userIpRestrictions = user?.ipRestrictions || [];
        const allRestrictions = [...RESTRICTED_IP_RANGES, ...userIpRestrictions];
        
        const isRestricted = allRestrictions.some(range => 
          clientIp.startsWith(range)
        );
        
        if (isRestricted) {
          setIpAllowed(false);
          logAuditEvent({
            action: 'view_sensitive',
            resource: 'access_control',
            description: `Access denied from restricted IP: ${clientIp}`,
            userId: user?.id,
            severity: 'high',
            metadata: { ip: clientIp }
          });
          
          toast.error('Access Denied', {
            description: 'You are accessing from a restricted IP address',
            duration: 5000,
          });
          
          navigate('/access-denied');
        }
      } catch (error) {
        console.error('Error checking IP restrictions:', error);
      }
    };
    
    // Update last activity timestamp on user interaction
    const updateActivity = () => {
      setLastActivity(Date.now());
    };
    
    // Session timeout checker
    const checkSessionTimeout = () => {
      const now = Date.now();
      const inactiveTime = (now - lastActivity) / (1000 * 60); // Convert to minutes
      
      if (inactiveTime >= SESSION_TIMEOUT_MINUTES) {
        logAuditEvent({
          action: 'logout',
          resource: 'user',
          resourceId: user?.id,
          description: 'User automatically logged out due to inactivity',
          userId: user?.id,
          severity: 'medium',
        });
        
        toast.warning('Session Expired', {
          description: 'You have been logged out due to inactivity',
        });
        
        // Force logout via navigation instead of calling logout directly
        // to avoid potential issues with concurrent state updates
        navigate('/login', { state: { sessionExpired: true } });
      }
    };
    
    // Set up event listeners and timers
    checkIpRestrictions();
    
    const sessionCheckInterval = setInterval(checkSessionTimeout, 60000); // Check every minute
    
    // Activity events to track user interaction
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      window.addEventListener(event, updateActivity);
    });
    
    return () => {
      clearInterval(sessionCheckInterval);
      events.forEach(event => {
        window.removeEventListener(event, updateActivity);
      });
    };
  }, [isAuthenticated, user, navigate, lastActivity]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (suspicious) {
    return <Navigate to="/access-denied" state={{ reason: 'suspicious' }} replace />;
  }

  if (!isAuthenticated) {
    // Check for iframe embedding - Skip this check in Lovable preview
    const isInIframe = !isLovablePreview() && window.self !== window.top;
    
    if (isInIframe) {
      // Log iframe embedding attempt
      logAuditEvent({
        action: 'view_sensitive',
        resource: 'access_control',
        description: 'Login page loaded in iframe (potential clickjacking)',
        severity: 'high'
      });
    }
    
    // Log access attempt
    logAuditEvent({
      action: 'view_sensitive',
      resource: resourceType ? (resourceType as any) : 'access_control',
      resourceId,
      description: `Unauthenticated user attempted to access protected route: ${location.pathname}`,
      severity: 'medium',
    });
    
    // Redirect to login page with the return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check IP restrictions
  if (!ipAllowed) {
    return <Navigate to="/access-denied" replace />;
  }

  // If MFA is required but not completed
  if (requireMfa && !user?.mfaVerified) {
    // Log MFA requirement
    logAuditEvent({
      action: 'view_sensitive',
      resource: resourceType ? (resourceType as any) : 'access_control',
      resourceId,
      description: `MFA required for accessing route: ${location.pathname}`,
      userId: user?.id,
      severity: 'medium',
    });
    
    // Redirect to MFA verification page
    return <Navigate to="/mfa-verify" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has permission
  if (requiredRoles.length > 0 && !hasPermission(requiredRoles)) {
    // Log unauthorized access attempt
    logAuditEvent({
      action: 'view_sensitive',
      resource: resourceType ? (resourceType as any) : 'access_control',
      resourceId,
      description: `User attempted to access route without proper permissions: ${location.pathname}`,
      userId: user?.id,
      severity: 'high',
      metadata: {
        requiredRoles,
        userRole: user?.role,
        action: actionType
      }
    });
    
    return <AccessDenied requiredRole={requiredRoles[0]} />;
  }
  
  // If the user has permission, log access for audit purposes
  if (resourceType && actionType !== 'view') {
    logAuditEvent({
      action: actionType === 'edit' ? 'update' : actionType === 'delete' ? 'delete' : 'view_sensitive',
      resource: resourceType as any,
      resourceId,
      description: `User accessed ${actionType} on ${resourceType}${resourceId ? ` (ID: ${resourceId})` : ''}`,
      userId: user?.id,
      severity: actionType === 'admin' ? 'high' : 'medium'
    });
  }

  return <>{children}</>;
};

export default AuthGuard;
