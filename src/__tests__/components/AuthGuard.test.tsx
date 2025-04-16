
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';
import * as authHook from '@/hooks/useAuth';
import * as auditService from '@/services/auditService';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

// Mock the audit service
vi.mock('@/services/auditService', () => ({
  logAuditEvent: vi.fn()
}));

describe('AuthGuard', () => {
  it('redirects to login when user is not authenticated', () => {
    // Setup mock
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      hasPermission: () => false,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
      updateProfile: vi.fn(),
    });
    
    // Render component
    render(
      <BrowserRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </BrowserRouter>
    );
    
    // Verify audit log was called
    expect(auditService.logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'view_sensitive',
        severity: 'medium',
      })
    );
    
    // Assertion: component should not render children
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
  
  it('renders children when user is authenticated', () => {
    // Setup mock
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { 
        id: '123', 
        name: 'Test User', 
        email: 'test@example.com', 
        role: 'viewer' 
      },
      hasPermission: () => true,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
      updateProfile: vi.fn(),
    });
    
    // Render component
    render(
      <BrowserRouter>
        <AuthGuard>
          <div>Protected Content</div>
        </AuthGuard>
      </BrowserRouter>
    );
    
    // Assertion: component should render children
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
  
  it('renders access denied when user lacks required roles', () => {
    // Setup mock with permission check that fails
    vi.spyOn(authHook, 'useAuth').mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { 
        id: '123', 
        name: 'Test User', 
        email: 'test@example.com', 
        role: 'viewer' 
      },
      hasPermission: () => false, // This will make the role check fail
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
      updateProfile: vi.fn(),
    });
    
    // Render with required roles
    render(
      <BrowserRouter>
        <AuthGuard requiredRoles={['admin']}>
          <div>Admin Content</div>
        </AuthGuard>
      </BrowserRouter>
    );
    
    // Verify audit log was called for unauthorized access
    expect(auditService.logAuditEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'view_sensitive',
        severity: 'high',
      })
    );
    
    // Assertion: component should not render children
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
