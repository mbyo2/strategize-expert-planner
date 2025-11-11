import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSimpleAuth } from '@/hooks/useSimpleAuth';
import { toast } from 'sonner';

interface Organization {
  id: string;
  name: string;
  settings?: any;
  created_at: string;
  updated_at: string;
}

interface OrganizationContextType {
  organization: Organization | null;
  organizationId: string | null;
  isLoading: boolean;
  refreshOrganization: () => Promise<void>;
  setOrganizationId: (id: string | null) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { session, isAuthenticated } = useSimpleAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [organizationId, setOrgId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrganization = async (orgId: string) => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

      if (error) throw error;
      setOrganization(data);
    } catch (error) {
      console.error('Error fetching organization:', error);
      toast.error('Failed to load organization details');
      setOrganization(null);
    }
  };

  const fetchUserOrganization = async (userId: string) => {
    try {
      // First check if user has an organization in their profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('organization_id')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      if (profile?.organization_id) {
        setOrgId(profile.organization_id);
        await fetchOrganization(profile.organization_id);
      } else {
        // Check organization_members table
        const { data: membership, error: memberError } = await supabase
          .from('organization_members')
          .select('organization_id')
          .eq('user_id', userId)
          .limit(1)
          .single();

        if (!memberError && membership) {
          setOrgId(membership.organization_id);
          await fetchOrganization(membership.organization_id);
        } else {
          setOrganization(null);
          setOrgId(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user organization:', error);
      setOrganization(null);
      setOrgId(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && session?.user?.id) {
      setIsLoading(true);
      fetchUserOrganization(session.user.id);
    } else {
      setOrganization(null);
      setOrgId(null);
      setIsLoading(false);
    }
  }, [isAuthenticated, session?.user?.id]);

  const refreshOrganization = async () => {
    if (organizationId) {
      await fetchOrganization(organizationId);
    } else if (session?.user?.id) {
      await fetchUserOrganization(session.user.id);
    }
  };

  const setOrganizationId = (id: string | null) => {
    setOrgId(id);
    if (id) {
      fetchOrganization(id);
    } else {
      setOrganization(null);
    }
  };

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        organizationId,
        isLoading,
        refreshOrganization,
        setOrganizationId,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
