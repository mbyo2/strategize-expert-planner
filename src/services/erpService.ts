import { supabase } from '@/integrations/supabase/client';
import { ERPModule, OrganizationERPConfig, ERPEntity, ERPStrategicLink } from '@/types/erp';
import { erpEntitySchemas } from './validation/validatedServiceWrapper';
import { validateForInsert, validateForUpdate } from './validation/validatedService';

export class ERPService {
  // ERP Modules
  static async getAvailableModules(): Promise<ERPModule[]> {
    const { data, error } = await supabase
      .from('erp_modules')
      .select('*')
      .order('is_core_module', { ascending: false })
      .order('industry_category')
      .order('name');

    if (error) throw error;
    return data || [];
  }

  static async getModulesByCategory(category: string): Promise<ERPModule[]> {
    const { data, error } = await supabase
      .from('erp_modules')
      .select('*')
      .eq('industry_category', category)
      .order('name');

    if (error) throw error;
    return data || [];
  }

  // Organization ERP Configuration
  static async getOrganizationERPConfig(organizationId: string): Promise<OrganizationERPConfig | null> {
    const { data, error } = await supabase
      .from('organization_erp_config')
      .select('*')
      .eq('organization_id', organizationId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data as OrganizationERPConfig | null;
  }

  static async updateOrganizationERPConfig(
    organizationId: string,
    config: Partial<OrganizationERPConfig>
  ): Promise<OrganizationERPConfig> {
    const { data, error } = await supabase
      .from('organization_erp_config')
      .upsert({
        organization_id: organizationId,
        ...config
      })
      .select()
      .single();

    if (error) throw error;
    return data as OrganizationERPConfig;
  }

  static async activateModules(organizationId: string, moduleKeys: string[]): Promise<void> {
    const existingConfig = await this.getOrganizationERPConfig(organizationId);
    const currentModules = existingConfig?.active_modules || [];
    const updatedModules = [...new Set([...currentModules, ...moduleKeys])];

    await this.updateOrganizationERPConfig(organizationId, {
      active_modules: updatedModules
    });
  }

  static async deactivateModules(organizationId: string, moduleKeys: string[]): Promise<void> {
    const existingConfig = await this.getOrganizationERPConfig(organizationId);
    const currentModules = existingConfig?.active_modules || [];
    const updatedModules = currentModules.filter(key => !moduleKeys.includes(key));

    await this.updateOrganizationERPConfig(organizationId, {
      active_modules: updatedModules
    });
  }

  // ERP Entities
  static async getERPEntities(
    organizationId: string,
    moduleKey?: string,
    entityType?: string
  ): Promise<ERPEntity[]> {
    let query = supabase
      .from('erp_entities')
      .select('*')
      .eq('organization_id', organizationId);

    if (moduleKey) {
      query = query.eq('module_key', moduleKey);
    }

    if (entityType) {
      query = query.eq('entity_type', entityType);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as ERPEntity[];
  }

  static async createERPEntity(entity: Omit<ERPEntity, 'id' | 'created_at' | 'updated_at'>): Promise<ERPEntity> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');

    // Validate and sanitize input
    const validatedEntity = await validateForInsert(erpEntitySchemas.create, {
      ...entity,
      created_by: user.user.id
    });

    const { data, error } = await supabase
      .from('erp_entities')
      .insert(validatedEntity as any)
      .select()
      .single();

    if (error) throw error;
    return data as ERPEntity;
  }

  static async updateERPEntity(
    id: string,
    updates: Partial<ERPEntity>
  ): Promise<ERPEntity> {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) throw new Error('User not authenticated');
    
    // Validate and sanitize input
    const validatedUpdates = await validateForUpdate(erpEntitySchemas.update, {
      ...updates,
      updated_by: user.user.id
    });

    const { data, error } = await supabase
      .from('erp_entities')
      .update(validatedUpdates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as ERPEntity;
  }

  static async deleteERPEntity(id: string): Promise<void> {
    const { error } = await supabase
      .from('erp_entities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Strategic Integration
  static async linkERPToStrategy(link: Omit<ERPStrategicLink, 'id' | 'created_at'>): Promise<ERPStrategicLink> {
    const { data, error } = await supabase
      .from('erp_strategic_links')
      .insert(link)
      .select()
      .single();

    if (error) throw error;
    return data as ERPStrategicLink;
  }

  static async getStrategicLinks(
    organizationId: string,
    options?: {
      strategic_goal_id?: string;
      planning_initiative_id?: string;
      erp_entity_id?: string;
    }
  ): Promise<ERPStrategicLink[]> {
    let query = supabase
      .from('erp_strategic_links')
      .select('*')
      .eq('organization_id', organizationId);

    if (options?.strategic_goal_id) {
      query = query.eq('strategic_goal_id', options.strategic_goal_id);
    }

    if (options?.planning_initiative_id) {
      query = query.eq('planning_initiative_id', options.planning_initiative_id);
    }

    if (options?.erp_entity_id) {
      query = query.eq('erp_entity_id', options.erp_entity_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as ERPStrategicLink[];
  }

  static async unlinkERPFromStrategy(linkId: string): Promise<void> {
    const { error } = await supabase
      .from('erp_strategic_links')
      .delete()
      .eq('id', linkId);

    if (error) throw error;
  }

  // Analytics and Reporting
  static async getERPAnalytics(organizationId: string) {
    const [entities, links] = await Promise.all([
      this.getERPEntities(organizationId),
      this.getStrategicLinks(organizationId)
    ]);

    // Group entities by module
    const entitiesByModule = entities.reduce((acc, entity) => {
      acc[entity.module_key] = (acc[entity.module_key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Group links by type
    const linksByType = links.reduce((acc, link) => {
      acc[link.link_type] = (acc[link.link_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalEntities: entities.length,
      entitiesByModule,
      totalStrategicLinks: links.length,
      linksByType,
      activeModules: Object.keys(entitiesByModule)
    };
  }
}