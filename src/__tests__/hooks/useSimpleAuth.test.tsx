import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SimpleAuthProvider, useSimpleAuth } from '@/hooks/useSimpleAuth';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');

describe('useSimpleAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with no user', () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null
    });

    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: {
        subscription: {
          unsubscribe: vi.fn()
        }
      }
    } as any);

    const { result } = renderHook(() => useSimpleAuth(), {
      wrapper: SimpleAuthProvider
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.session.user).toBeNull();
  });
});
