import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { OrganizationProvider, useOrganization } from '@/contexts/OrganizationContext';
import { supabase } from '@/integrations/supabase/client';

vi.mock('@/integrations/supabase/client');
vi.mock('@/hooks/useSimpleAuth', () => ({
  useSimpleAuth: () => ({
    session: { user: { id: 'user-1' } },
    isAuthenticated: true
  })
}));

describe('OrganizationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize context', async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null })
    } as any);

    const { result } = renderHook(() => useOrganization(), {
      wrapper: OrganizationProvider
    });

    expect(result.current).toBeDefined();
    expect(result.current.organization).toBeNull();
  });
});
