import { useState, useEffect, useCallback } from 'react';
import { enhancedSessionService } from '@/services/enhancedSessionService';
import { logAuditEvent } from '@/services/auditService';
import { toast } from 'sonner';

interface SecurityEvent {
  type: 'suspicious_activity' | 'multiple_sessions' | 'session_expired' | 'failed_validation';
  timestamp: Date;
  details: string;
}

interface SecurityMonitorState {
  isSecure: boolean;
  events: SecurityEvent[];
  activeSessions: number;
  lastSecurityCheck: Date | null;
}

export const useSecurityMonitor = () => {
  const [state, setState] = useState<SecurityMonitorState>({
    isSecure: true,
    events: [],
    activeSessions: 0,
    lastSecurityCheck: null
  });

  const [isMonitoring, setIsMonitoring] = useState(false);

  const logSecurityEvent = useCallback((event: Omit<SecurityEvent, 'timestamp'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      timestamp: new Date()
    };

    setState(prev => ({
      ...prev,
      events: [newEvent, ...prev.events.slice(0, 9)], // Keep last 10 events
      isSecure: event.type !== 'suspicious_activity'
    }));

    // Log to audit system
    logAuditEvent({
      action: 'unauthorized_access',
      resource: 'user',
      new_values: { event_type: event.type, details: event.details }
    });

    // Show toast for critical events
    if (event.type === 'suspicious_activity') {
      toast.error(`Security Alert: ${event.details}`);
    }
  }, []);

  const checkSessionSecurity = useCallback(async () => {
    try {
      const sessions = await enhancedSessionService.getUserSessions();
      const activeSessionCount = sessions.filter(s => s.is_active).length;

      setState(prev => ({
        ...prev,
        activeSessions: activeSessionCount,
        lastSecurityCheck: new Date()
      }));

      // Alert if too many active sessions
      if (activeSessionCount > 5) {
        logSecurityEvent({
          type: 'multiple_sessions',
          details: `${activeSessionCount} active sessions detected`
        });
      }

      // Check for sessions from different locations/devices
      const uniqueUserAgents = new Set(sessions.map(s => s.user_agent));
      if (uniqueUserAgents.size > 3) {
        logSecurityEvent({
          type: 'suspicious_activity',
          details: 'Sessions from multiple devices detected'
        });
      }

      return true;
    } catch (error) {
      logSecurityEvent({
        type: 'failed_validation',
        details: 'Failed to validate session security'
      });
      return false;
    }
  }, [logSecurityEvent]);

  const terminateAllOtherSessions = useCallback(async () => {
    try {
      const success = await enhancedSessionService.terminateAllOtherSessions();
      if (success) {
        toast.success('All other sessions terminated successfully');
        await checkSessionSecurity(); // Refresh session count
      } else {
        toast.error('Failed to terminate other sessions');
      }
      return success;
    } catch (error) {
      toast.error('Error terminating sessions');
      return false;
    }
  }, [checkSessionSecurity]);

  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);
    
    // Check security every 5 minutes
    const securityInterval = setInterval(checkSessionSecurity, 5 * 60 * 1000);
    
    // Update session activity every 30 seconds
    const activityInterval = setInterval(() => {
      enhancedSessionService.updateSessionActivity();
    }, 30 * 1000);

    // Clean up expired sessions every hour
    const cleanupInterval = setInterval(() => {
      enhancedSessionService.cleanupExpiredSessions();
    }, 60 * 60 * 1000);

    // Initial security check
    checkSessionSecurity();

    // Return cleanup function
    return () => {
      clearInterval(securityInterval);
      clearInterval(activityInterval);
      clearInterval(cleanupInterval);
      setIsMonitoring(false);
    };
  }, [isMonitoring, checkSessionSecurity]);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, [startMonitoring]);

  return {
    ...state,
    isMonitoring,
    checkSessionSecurity,
    terminateAllOtherSessions,
    startMonitoring,
    stopMonitoring,
    logSecurityEvent
  };
};