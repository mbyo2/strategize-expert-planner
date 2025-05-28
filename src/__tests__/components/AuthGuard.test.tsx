
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/hooks/useAuth';

// Mock the useAuth hook
jest.mock('@/hooks/useAuth');
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock the audit service
jest.mock('@/services/auditService', () => ({
  logAuditEvent: jest.fn(),
}));

// Mock the security utils
jest.mock('@/utils/securityUtils', () => ({
  sanitizeInput: jest.fn((input) => input),
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
    jest.clearAllMocks();
  });

  it('shows loading spinner when authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: true,
      hasPermission: jest.fn(),
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      getSecuritySettings: jest.fn(),
      updateSecuritySettings: jest.fn(),
      verifyMfa: jest.fn(),
      setupMfa: jest.fn(),
    });

    renderWithRouter(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    );

    expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      hasPermission: jest.fn(),
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      getSecuritySettings: jest.fn(),
      updateSecuritySettings: jest.fn(),
      verifyMfa: jest.fn(),
      setupMfa: jest.fn(),
    });

    renderWithRouter(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    );

    // Should redirect to login, so protected content should not be visible
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: '1', email: 'test@test.com', role: 'viewer' as any },
      isLoading: false,
      hasPermission: jest.fn().mockReturnValue(true),
      login: jest.fn(),
      signup: jest.fn(),
      logout: jest.fn(),
      updateProfile: jest.fn(),
      getSecuritySettings: jest.fn(),
      updateSecuritySettings: jest.fn(),
      verifyMfa: jest.fn(),
      setupMfa: jest.fn(),
    });

    renderWithRouter(
      <AuthGuard>
        <TestComponent />
      </AuthGuard>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
