
import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');
const mockUseAuth = vi.mocked(useAuth);

// Mock the audit service
vi.mock('@/services/auditService', () => ({
  logAuditEvent: vi.fn(),
}));

// Mock the security utils
vi.mock('@/utils/securityUtils', () => ({
  sanitizeInput: vi.fn((input) => input),
}));

const TestComponent = () => <div>Protected Content</div>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('AuthGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading spinner when authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
      hasPermission: vi.fn(),
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      getSecuritySettings: vi.fn(),
      updateSecuritySettings: vi.fn(),
      verifyMfa: vi.fn(),
      setupMfa: vi.fn(),
    });

    const { container } = renderWithRouter(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    );

    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      hasPermission: vi.fn(),
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      getSecuritySettings: vi.fn(),
      updateSecuritySettings: vi.fn(),
      verifyMfa: vi.fn(),
      setupMfa: vi.fn(),
    });

    const { queryByText } = renderWithRouter(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    );

    // Should redirect to login, so protected content should not be visible
    expect(queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { 
        id: '1', 
        email: 'test@test.com', 
        role: 'viewer' as any,
        name: 'Test User'
      },
      isLoading: false,
      hasPermission: vi.fn().mockReturnValue(true),
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
      updateProfile: vi.fn(),
      getSecuritySettings: vi.fn(),
      updateSecuritySettings: vi.fn(),
      verifyMfa: vi.fn(),
      setupMfa: vi.fn(),
    });

    const { getByText } = renderWithRouter(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });
});
