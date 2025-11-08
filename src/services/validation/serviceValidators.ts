/**
 * Service-level validation wrappers
 * Integrates validation into all service methods
 */

import { 
  strategicGoalCreateSchema, 
  strategicGoalUpdateSchema,
  planningInitiativeCreateSchema,
  planningInitiativeUpdateSchema,
  marketChangeCreateSchema,
  recommendationCreateSchema,
  organizationCreateSchema,
  organizationUpdateSchema,
  teamCreateSchema,
  supportTicketCreateSchema,
  erpEntityCreateSchema,
} from './schemas';
import { withValidation, validateForInsert, validateForUpdate } from './validatedService';
import { supabase } from '@/integrations/supabase/client';

/**
 * Validated Strategic Goals Service
 */
export const validatedGoalsService = {
  create: async (data: unknown) => {
    return withValidation(
      strategicGoalCreateSchema,
      data,
      async (validated) => {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('Not authenticated');

        const insertData = {
          name: validated.name,
          description: validated.description,
          status: validated.status,
          priority: validated.priority,
          category: validated.category,
          progress: validated.progress,
          target_value: validated.target_value,
          current_value: validated.current_value,
          start_date: validated.start_date,
          due_date: validated.due_date,
          risk_level: validated.risk_level,
          owner_id: validated.owner_id,
          user_id: user.user.id,
        };

        const { data: result, error } = await supabase
          .from('strategic_goals')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        return result;
      },
      { sanitize: true, showToast: true }
    );
  },

  update: async (id: string, data: unknown) => {
    return withValidation(
      strategicGoalUpdateSchema,
      data,
      async (validated) => {
        const { data: result, error } = await supabase
          .from('strategic_goals')
          .update({
            name: validated.name,
            description: validated.description,
            status: validated.status,
            priority: validated.priority,
            category: validated.category,
            progress: validated.progress,
            target_value: validated.target_value,
            current_value: validated.current_value,
            start_date: validated.start_date,
            due_date: validated.due_date,
            risk_level: validated.risk_level,
            owner_id: validated.owner_id,
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return result;
      },
      { sanitize: true, showToast: true }
    );
  },
};

/**
 * Validated Planning Initiatives Service
 */
export const validatedPlanningService = {
  create: async (data: unknown) => {
    return withValidation(
      planningInitiativeCreateSchema,
      data,
      async (validated) => {
        const insertData = {
          name: validated.name,
          description: validated.description,
          status: validated.status,
          priority: validated.priority,
          progress: validated.progress,
          start_date: validated.start_date,
          end_date: validated.end_date,
          budget: validated.budget,
          currency: validated.currency,
          owner_id: validated.owner_id,
        };

        const { data: result, error } = await supabase
          .from('planning_initiatives')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        return result;
      },
      { sanitize: true, showToast: true }
    );
  },

  update: async (id: string, data: unknown) => {
    return withValidation(
      planningInitiativeUpdateSchema,
      data,
      async (validated) => {
        const updateData: any = {};
        if (validated.name !== undefined) updateData.name = validated.name;
        if (validated.description !== undefined) updateData.description = validated.description;
        if (validated.status !== undefined) updateData.status = validated.status;
        if (validated.priority !== undefined) updateData.priority = validated.priority;
        if (validated.progress !== undefined) updateData.progress = validated.progress;
        if (validated.start_date !== undefined) updateData.start_date = validated.start_date;
        if (validated.end_date !== undefined) updateData.end_date = validated.end_date;
        if (validated.budget !== undefined) updateData.budget = validated.budget;
        if (validated.currency !== undefined) updateData.currency = validated.currency;
        if (validated.owner_id !== undefined) updateData.owner_id = validated.owner_id;

        const { data: result, error } = await supabase
          .from('planning_initiatives')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return result;
      },
      { sanitize: true, showToast: true }
    );
  },
};

/**
 * Validated Market Changes Service
 */
export const validatedMarketService = {
  create: async (data: unknown) => {
    return withValidation(
      marketChangeCreateSchema,
      data,
      async (validated) => {
        const insertData = {
          title: validated.title,
          description: validated.description,
          impact_level: validated.impact_level,
          source: validated.source,
          category: validated.category,
          date_identified: validated.date_identified,
        };

        const { data: result, error } = await supabase
          .from('market_changes')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        return result;
      },
      { sanitize: true, showToast: true }
    );
  },
};

/**
 * Validated Organizations Service
 */
export const validatedOrganizationService = {
  create: async (data: unknown) => {
    return withValidation(
      organizationCreateSchema,
      data,
      async (validated) => {
        const insertData = {
          name: validated.name,
          description: validated.description,
          industry: validated.industry,
          size: validated.size,
          website: validated.website,
          logo_url: validated.logo_url,
        };

        const { data: result, error } = await supabase
          .from('organizations')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        return result;
      },
      { sanitize: true, showToast: true }
    );
  },

  update: async (id: string, data: unknown) => {
    return withValidation(
      organizationUpdateSchema,
      data,
      async (validated) => {
        const updateData: any = {};
        if (validated.name !== undefined) updateData.name = validated.name;
        if (validated.description !== undefined) updateData.description = validated.description;
        if (validated.industry !== undefined) updateData.industry = validated.industry;
        if (validated.size !== undefined) updateData.size = validated.size;
        if (validated.website !== undefined) updateData.website = validated.website;
        if (validated.logo_url !== undefined) updateData.logo_url = validated.logo_url;

        const { data: result, error } = await supabase
          .from('organizations')
          .update(updateData)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return result;
      },
      { sanitize: true, showToast: true }
    );
  },
};

/**
 * Validated ERP Service
 */
export const validatedERPService = {
  createEntity: async (data: unknown) => {
    return withValidation(
      erpEntityCreateSchema,
      data,
      async (validated) => {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('Not authenticated');

        const insertData = {
          module_key: validated.module_key,
          entity_type: validated.entity_type,
          organization_id: validated.organization_id,
          entity_data: validated.entity_data,
          metadata: validated.metadata,
          created_by: user.user.id,
        };

        const { data: result, error } = await supabase
          .from('erp_entities')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        return result;
      },
      { 
        sanitize: true, 
        showToast: true,
        errorMessage: 'Failed to create ERP entity. Please check your input and try again.'
      }
    );
  },
};

/**
 * Validated Support Ticket Service
 */
export const validatedSupportService = {
  create: async (data: unknown) => {
    return withValidation(
      supportTicketCreateSchema,
      data,
      async (validated) => {
        const { data: user } = await supabase.auth.getUser();
        if (!user.user) throw new Error('Not authenticated');

        const insertData = {
          title: validated.title,
          description: validated.description,
          category: validated.category,
          priority: validated.priority,
          user_id: user.user.id,
        };

        const { data: result, error } = await supabase
          .from('support_tickets')
          .insert(insertData)
          .select()
          .single();

        if (error) throw error;
        return result;
      },
      { sanitize: true, showToast: true }
    );
  },
};
