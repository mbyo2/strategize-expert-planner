import { z } from 'zod';

// Common validation schemas
export const uuidSchema = z.string().uuid('Invalid UUID format');
export const emailSchema = z.string().email('Invalid email address');
export const urlSchema = z.string().url('Invalid URL format').optional();

// User and Profile schemas
export const profileUpdateSchema = z.object({
  full_name: z.string().min(1).max(255).optional(),
  avatar_url: urlSchema,
  bio: z.string().max(1000).optional(),
  phone: z.string().max(50).optional(),
  location: z.string().max(255).optional(),
});

export const userRoleSchema = z.object({
  user_id: uuidSchema,
  role: z.enum(['superuser', 'admin', 'manager', 'analyst', 'viewer']),
});

// Organization schemas
export const organizationCreateSchema = z.object({
  name: z.string().min(1, 'Organization name is required').max(255),
  description: z.string().max(1000).optional(),
  industry: z.string().max(100).optional(),
  size: z.string().max(50).optional(),
  website: urlSchema,
  logo_url: urlSchema,
});

export const organizationUpdateSchema = organizationCreateSchema.partial();

export const organizationMemberSchema = z.object({
  organization_id: uuidSchema,
  user_id: uuidSchema,
  role: z.enum(['admin', 'manager', 'analyst', 'viewer']),
});

export const organizationSettingsSchema = z.object({
  enforce_mfa: z.boolean().optional(),
  sso_enabled: z.boolean().optional(),
  sso_provider: z.string().max(100).optional(),
  sso_domain: z.string().max(255).optional(),
  ip_restrictions_enabled: z.boolean().optional(),
  allowed_ip_ranges: z.array(z.string()).optional(),
  allowed_email_domains: z.array(z.string()).optional(),
  session_duration_minutes: z.number().int().min(5).max(43200).optional(), // 5 min to 30 days
  data_retention_days: z.number().int().min(1).max(3650).optional(), // 1 day to 10 years
  compliance_mode: z.enum(['standard', 'hipaa', 'gdpr', 'sox']).optional(),
  api_rate_limit_per_minute: z.number().int().min(1).max(10000).optional(),
  webhook_urls: z.array(urlSchema).optional(),
  default_user_role: z.enum(['viewer', 'analyst', 'manager']).optional(),
});

// Strategic Goal schemas
export const strategicGoalCreateSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(255),
  description: z.string().max(1000).optional(),
  status: z.enum(['planned', 'in_progress', 'completed', 'on_hold']),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  category: z.string().max(100).optional(),
  progress: z.number().int().min(0).max(100).default(0),
  target_value: z.number().optional(),
  current_value: z.number().optional(),
  start_date: z.string().datetime().optional(),
  due_date: z.string().datetime().optional(),
  risk_level: z.enum(['low', 'medium', 'high']).optional(),
  owner_id: uuidSchema.optional(),
});

export const strategicGoalUpdateSchema = strategicGoalCreateSchema.partial();

// Planning Initiative schemas
export const planningInitiativeCreateSchema = z.object({
  name: z.string().min(1, 'Initiative name is required').max(255),
  description: z.string().max(1000).optional(),
  status: z.enum(['planning', 'in_progress', 'completed', 'on_hold']),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  progress: z.number().int().min(0).max(100).default(0),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  budget: z.number().positive().optional(),
  currency: z.string().length(3).optional().default('USD'),
  owner_id: uuidSchema.optional(),
});

export const planningInitiativeUpdateSchema = planningInitiativeCreateSchema.partial();

// Market Change schemas
export const marketChangeCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required').max(2000),
  impact_level: z.enum(['low', 'medium', 'high']),
  source: z.string().max(255).optional(),
  category: z.string().max(100).optional(),
  date_identified: z.string().datetime().optional(),
});

export const marketChangeUpdateSchema = marketChangeCreateSchema.partial();

// Recommendation schemas
export const recommendationCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required').max(2000),
  priority: z.number().int().min(1).max(5).optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'implemented']).default('pending'),
  category: z.string().max(100).optional(),
});

export const recommendationUpdateSchema = recommendationCreateSchema.partial();

// Team schemas
export const teamCreateSchema = z.object({
  name: z.string().min(1, 'Team name is required').max(255),
  description: z.string().max(1000).optional(),
  department: z.string().max(100).optional(),
});

export const teamUpdateSchema = teamCreateSchema.partial();

export const teamMemberSchema = z.object({
  team_id: uuidSchema,
  user_id: uuidSchema,
  role: z.enum(['admin', 'manager', 'member']),
  department: z.string().max(100).optional(),
  position: z.string().max(100).optional(),
});

// ERP schemas
export const erpEntityCreateSchema = z.object({
  module_key: z.string().min(1, 'Module key is required').max(100),
  entity_type: z.string().min(1, 'Entity type is required').max(100),
  organization_id: uuidSchema,
  entity_data: z.record(z.any()).refine(
    (data) => {
      // Prevent common injection patterns in JSONB data
      const jsonStr = JSON.stringify(data);
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i, // event handlers
        /data:text\/html/i,
      ];
      return !dangerousPatterns.some(pattern => pattern.test(jsonStr));
    },
    { message: 'Entity data contains potentially dangerous content' }
  ),
  metadata: z.record(z.any()).optional(),
});

export const erpEntityUpdateSchema = z.object({
  entity_data: z.record(z.any()).refine(
    (data) => {
      const jsonStr = JSON.stringify(data);
      const dangerousPatterns = [
        /<script/i,
        /javascript:/i,
        /on\w+\s*=/i,
        /data:text\/html/i,
      ];
      return !dangerousPatterns.some(pattern => pattern.test(jsonStr));
    },
    { message: 'Entity data contains potentially dangerous content' }
  ).optional(),
  metadata: z.record(z.any()).optional(),
});

// Support Ticket schemas
export const supportTicketCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().min(1, 'Description is required').max(5000),
  category: z.enum(['general', 'technical', 'billing', 'feature_request', 'bug_report']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
});

export const supportTicketUpdateSchema = z.object({
  status: z.enum(['open', 'in_progress', 'waiting_customer', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigned_to: uuidSchema.optional(),
  resolution_notes: z.string().max(5000).optional(),
});

// Invitation schemas
export const invitationCreateSchema = z.object({
  email: emailSchema,
  role: z.enum(['admin', 'manager', 'analyst', 'viewer', 'member']),
});

// Validation helper function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return {
    success: false,
    errors: result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
  };
}
