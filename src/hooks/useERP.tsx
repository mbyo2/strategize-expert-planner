import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ERPService } from '@/services/erpService';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useERPModules = () => {
  const { data: modules = [], isLoading, error } = useQuery({
    queryKey: ['erp-modules'],
    queryFn: ERPService.getAvailableModules,
  });

  return {
    modules,
    isLoading,
    error
  };
};

export const useOrganizationERP = (organizationId: string) => {
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ['organization-erp-config', organizationId],
    queryFn: () => ERPService.getOrganizationERPConfig(organizationId),
    enabled: !!organizationId
  });

  const activateModulesMutation = useMutation({
    mutationFn: (moduleKeys: string[]) => 
      ERPService.activateModules(organizationId, moduleKeys),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-erp-config', organizationId] });
      toast.success('ERP modules activated successfully');
    },
    onError: (error) => {
      console.error('Error activating modules:', error);
      toast.error('Failed to activate ERP modules');
    }
  });

  const deactivateModulesMutation = useMutation({
    mutationFn: (moduleKeys: string[]) => 
      ERPService.deactivateModules(organizationId, moduleKeys),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-erp-config', organizationId] });
      toast.success('ERP modules deactivated successfully');
    },
    onError: (error) => {
      console.error('Error deactivating modules:', error);
      toast.error('Failed to deactivate ERP modules');
    }
  });

  const updateConfigMutation = useMutation({
    mutationFn: (updates: any) => 
      ERPService.updateOrganizationERPConfig(organizationId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization-erp-config', organizationId] });
      toast.success('ERP configuration updated successfully');
    },
    onError: (error) => {
      console.error('Error updating ERP config:', error);
      toast.error('Failed to update ERP configuration');
    }
  });

  return {
    config,
    isLoading,
    activateModules: activateModulesMutation.mutate,
    deactivateModules: deactivateModulesMutation.mutate,
    updateConfig: updateConfigMutation.mutate,
    isActivating: activateModulesMutation.isPending,
    isDeactivating: deactivateModulesMutation.isPending,
    isUpdating: updateConfigMutation.isPending
  };
};

export const useERPEntities = (
  organizationId: string,
  moduleKey?: string,
  entityType?: string
) => {
  const queryClient = useQueryClient();

  const { data: entities = [], isLoading, error } = useQuery({
    queryKey: ['erp-entities', organizationId, moduleKey, entityType],
    queryFn: () => ERPService.getERPEntities(organizationId, moduleKey, entityType),
    enabled: !!organizationId
  });

  const createEntityMutation = useMutation({
    mutationFn: ERPService.createERPEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['erp-entities'] });
      toast.success('ERP entity created successfully');
    },
    onError: (error) => {
      console.error('Error creating entity:', error);
      toast.error('Failed to create ERP entity');
    }
  });

  const updateEntityMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      ERPService.updateERPEntity(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['erp-entities'] });
      toast.success('ERP entity updated successfully');
    },
    onError: (error) => {
      console.error('Error updating entity:', error);
      toast.error('Failed to update ERP entity');
    }
  });

  const deleteEntityMutation = useMutation({
    mutationFn: ERPService.deleteERPEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['erp-entities'] });
      toast.success('ERP entity deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting entity:', error);
      toast.error('Failed to delete ERP entity');
    }
  });

  return {
    entities,
    isLoading,
    error,
    createEntity: createEntityMutation.mutate,
    updateEntity: updateEntityMutation.mutate,
    deleteEntity: deleteEntityMutation.mutate,
    isCreating: createEntityMutation.isPending,
    isUpdating: updateEntityMutation.isPending,
    isDeleting: deleteEntityMutation.isPending
  };
};

export const useERPStrategicIntegration = (organizationId: string) => {
  const queryClient = useQueryClient();

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['erp-strategic-links', organizationId],
    queryFn: () => ERPService.getStrategicLinks(organizationId),
    enabled: !!organizationId
  });

  const linkToStrategyMutation = useMutation({
    mutationFn: ERPService.linkERPToStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['erp-strategic-links'] });
      toast.success('ERP data linked to strategic planning successfully');
    },
    onError: (error) => {
      console.error('Error linking to strategy:', error);
      toast.error('Failed to link ERP data to strategic planning');
    }
  });

  const unlinkFromStrategyMutation = useMutation({
    mutationFn: ERPService.unlinkERPFromStrategy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['erp-strategic-links'] });
      toast.success('ERP data unlinked from strategic planning');
    },
    onError: (error) => {
      console.error('Error unlinking from strategy:', error);
      toast.error('Failed to unlink ERP data from strategic planning');
    }
  });

  return {
    links,
    isLoading,
    linkToStrategy: linkToStrategyMutation.mutate,
    unlinkFromStrategy: unlinkFromStrategyMutation.mutate,
    isLinking: linkToStrategyMutation.isPending,
    isUnlinking: unlinkFromStrategyMutation.isPending
  };
};

export const useERPAnalytics = (organizationId: string) => {
  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['erp-analytics', organizationId],
    queryFn: () => ERPService.getERPAnalytics(organizationId),
    enabled: !!organizationId
  });

  return {
    analytics,
    isLoading,
    error
  };
};