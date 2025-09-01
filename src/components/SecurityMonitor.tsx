import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { logAuditEvent } from '@/services/auditService';
import { isSecureConnection, redactSensitiveData } from '@/utils/secureUtils';

interface SecurityThreat {
  type: 'injection' | 'xss' | 'csrf' | 'session' | 'network';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
}

/**
 * Security monitoring component that runs in the background
 * Detects and responds to various security threats
 */
const SecurityMonitor: React.FC = () => {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [securityScore, setSecurityScore] = useState<number>(100);

  useEffect(() => {
    // Check initial security posture
    performSecurityChecks();
    
    // Set up periodic security monitoring
    const securityInterval = setInterval(performSecurityChecks, 30000); // Every 30 seconds
    
    // Monitor for suspicious DOM changes
    const observer = new MutationObserver(handleDOMChanges);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['onclick', 'onload', 'onerror']
    });
    
    // Monitor for suspicious console activity
    const originalConsole = console.log;
    console.log = (...args) => {
      checkConsoleActivity(args);
      originalConsole.apply(console, args);
    };
    
    // Monitor for suspicious network requests
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      await checkNetworkRequest(args[0]);
      return originalFetch.apply(window, args);
    };
    
    // Check for devtools
    let devtools = { open: false };
    const threshold = 160;
    
    const detectDevTools = () => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          handleSecurityThreat({
            type: 'session',
            severity: 'medium',
            message: 'Developer tools detected - potential security inspection',
            timestamp: new Date()
          });
        }
      } else {
        devtools.open = false;
      }
    };
    
    const devToolsInterval = setInterval(detectDevTools, 1000);
    
    return () => {
      clearInterval(securityInterval);
      clearInterval(devToolsInterval);
      observer.disconnect();
      console.log = originalConsole;
      window.fetch = originalFetch;
    };
  }, []);

  const performSecurityChecks = () => {
    let score = 100;
    const currentThreats: SecurityThreat[] = [];
    
    // Check if connection is secure
    if (!isSecureConnection()) {
      currentThreats.push({
        type: 'network',
        severity: 'high',
        message: 'Insecure connection detected - data may be intercepted',
        timestamp: new Date()
      });
      score -= 30;
    }
    
    // Check for mixed content
    if (document.querySelector('script[src^="http:"], link[href^="http:"], img[src^="http:"]')) {
      currentThreats.push({
        type: 'network',
        severity: 'medium',
        message: 'Mixed content detected - insecure resources loaded',
        timestamp: new Date()
      });
      score -= 15;
    }
    
    // Check for inline scripts (potential XSS)
    const inlineScripts = document.querySelectorAll('script:not([src])');
    if (inlineScripts.length > 2) { // Allow some inline scripts for legitimate use
      currentThreats.push({
        type: 'xss',
        severity: 'medium',
        message: 'Multiple inline scripts detected - potential XSS risk',
        timestamp: new Date()
      });
      score -= 10;
    }
    
    // Check for suspicious iframe sources
    const suspiciousIframes = document.querySelectorAll('iframe[src*="javascript:"], iframe[src*="data:"]');
    if (suspiciousIframes.length > 0) {
      currentThreats.push({
        type: 'xss',
        severity: 'high',
        message: 'Suspicious iframe detected - potential code injection',
        timestamp: new Date()
      });
      score -= 25;
    }
    
    // Check local storage for sensitive data (with redaction)
    const sensitiveKeys = ['password', 'token', 'secret', 'key'];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        currentThreats.push({
          type: 'session',
          severity: 'medium',
          message: 'Sensitive data found in local storage',
          timestamp: new Date()
        });
        score -= 10;
        break;
      }
    }
    
    // Update state
    setThreats(currentThreats);
    setSecurityScore(Math.max(0, score));
    
    // Log high severity threats with redacted data
    currentThreats.forEach(threat => {
      if (threat.severity === 'high') {
        logAuditEvent({
          action: 'view_sensitive',
          resource: 'user',
          description: redactSensitiveData(`Security threat detected: ${threat.message}`),
          severity: threat.severity,
          metadata: { 
            threatType: threat.type,
            securityScore: score
          }
        });
        
        toast.error('Security Alert', {
          description: threat.message,
        });
      }
    });
  };

  const handleDOMChanges = (mutations: MutationRecord[]) => {
    mutations.forEach(mutation => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check for suspicious script injections
            if (element.tagName === 'SCRIPT' && !element.getAttribute('src')) {
              handleSecurityThreat({
                type: 'xss',
                severity: 'high',
                message: 'Dynamic script injection detected',
                timestamp: new Date()
              });
            }
            
            // Check for suspicious event handlers
            const suspiciousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover'];
            suspiciousAttributes.forEach(attr => {
              if (element.getAttribute(attr)) {
                handleSecurityThreat({
                  type: 'xss',
                  severity: 'medium',
                  message: `Suspicious event handler detected: ${attr}`,
                  timestamp: new Date()
                });
              }
            });
          }
        });
      }
    });
  };

  const checkConsoleActivity = (args: any[]) => {
    const message = args.join(' ').toLowerCase();
    const suspiciousPatterns = [
      'eval(',
      'document.write',
      'innerHTML',
      'outerhtml',
      'javascript:',
      'vbscript:'
    ];
    
    if (suspiciousPatterns.some(pattern => message.includes(pattern))) {
      handleSecurityThreat({
        type: 'xss',
        severity: 'medium',
        message: 'Suspicious console activity detected',
        timestamp: new Date()
      });
    }
  };

  const checkNetworkRequest = async (url: string | Request | URL) => {
    const urlString = typeof url === 'string' ? url : url.toString();
    
    // Redact sensitive data before checking
    const redactedUrl = redactSensitiveData(urlString);
    
    // Check for suspicious domains
    const suspiciousDomains = [
      'bit.ly',
      'tinyurl.com',
      'goo.gl',
      't.co'
    ];
    
    try {
      const domain = new URL(urlString, window.location.origin).hostname;
      if (suspiciousDomains.includes(domain)) {
        handleSecurityThreat({
          type: 'network',
          severity: 'medium',
          message: `Request to suspicious domain: ${domain}`,
          timestamp: new Date()
        });
      }
    } catch (error) {
      // Invalid URL, potential security issue
      handleSecurityThreat({
        type: 'network',
        severity: 'medium',
        message: 'Request with invalid URL detected',
        timestamp: new Date()
      });
    }
    
    // Check for data exfiltration patterns
    if (urlString.includes('password') || urlString.includes('token') || urlString.includes('secret')) {
      handleSecurityThreat({
        type: 'network',
        severity: 'high',
        message: 'Potential data exfiltration attempt detected',
        timestamp: new Date()
      });
    }
  };

  const handleSecurityThreat = (threat: SecurityThreat) => {
    setThreats(prev => [...prev, threat]);
    
    // Log the threat with redacted sensitive data
    logAuditEvent({
      action: 'view_sensitive',
      resource: 'user',
      description: redactSensitiveData(`Security threat: ${threat.message}`),
      severity: threat.severity,
      metadata: { 
        threatType: threat.type,
        timestamp: threat.timestamp.toISOString()
      }
    });
    
    // Show notification for high severity threats
    if (threat.severity === 'high') {
      toast.error('Security Alert', {
        description: threat.message,
      });
    }
  };

  // This component runs in the background and doesn't render anything visible
  return null;
};

export default SecurityMonitor;