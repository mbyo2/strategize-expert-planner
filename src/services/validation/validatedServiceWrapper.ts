import { z } from 'zod';
import { withValidation } from './validatedService';
import { sanitizeJsonData } from './sanitization';

/**
 * Base schemas for common database operations
 */
export const baseSchemas = {
  uuid: z.string().uuid(),
  email: z.string().email().max(255),
  name: z.string().trim().min(1).max(255),
  description: z.string().max(5000).optional(),
  status: z.enum(['planned', 'active', 'completed', 'paused']),
  progress: z.number().min(0).max(100),
  date: z.string().datetime().optional(),
};

/**
 * Schemas for strategic goals
 */
export const strategicGoalSchemas = {
  create: z.object({
    name: baseSchemas.name,
    description: baseSchemas.description,
    status: baseSchemas.status,
    progress: baseSchemas.progress.default(0),
    target_value: z.number().optional(),
    current_value: z.number().optional(),
    start_date: baseSchemas.date,
    due_date: baseSchemas.date,
    user_id: baseSchemas.uuid,
  }),
  update: z.object({
    name: baseSchemas.name.optional(),
    description: baseSchemas.description,
    status: baseSchemas.status.optional(),
    progress: baseSchemas.progress.optional(),
    target_value: z.number().optional(),
    current_value: z.number().optional(),
    start_date: baseSchemas.date,
    due_date: baseSchemas.date,
  }),
};

/**
 * Schemas for planning initiatives
 */
export const planningInitiativeSchemas = {
  create: z.object({
    name: baseSchemas.name,
    description: baseSchemas.description,
    status: baseSchemas.status,
    priority: z.enum(['low', 'medium', 'high', 'critical']),
    start_date: baseSchemas.date,
    due_date: baseSchemas.date,
    user_id: baseSchemas.uuid,
    budget: z.number().optional(),
    resources: z.array(z.string()).optional(),
  }),
  update: z.object({
    name: baseSchemas.name.optional(),
    description: baseSchemas.description,
    status: baseSchemas.status.optional(),
    priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    start_date: baseSchemas.date,
    due_date: baseSchemas.date,
    budget: z.number().optional(),
    resources: z.array(z.string()).optional(),
  }),
};

/**
 * Schemas for ERP entities with JSONB validation
 */
export const erpEntitySchemas = {
  create: z.object({
    entity_type: z.string().min(1).max(100),
    entity_data: z.record(z.any()).refine(
      (data) => {
        const sanitized = sanitizeJsonData(data);
        return JSON.stringify(sanitized).length < 1000000; // 1MB limit
      },
      { message: 'Entity data too large' }
    ),
    metadata: z.record(z.any()).optional().refine(
      (data) => {
        if (!data) return true;
        const sanitized = sanitizeJsonData(data);
        return JSON.stringify(sanitized).length < 100000; // 100KB limit
      },
      { message: 'Metadata too large' }
    ),
    organization_id: baseSchemas.uuid,
    module_key: z.string().min(1).max(100),
  }),
  update: z.object({
    entity_data: z.record(z.any()).optional(),
    metadata: z.record(z.any()).optional(),
    status: z.string().optional(),
  }),
};

/**
 * Schemas for organization settings with JSONB validation
 */
export const organizationSchemas = {
  create: z.object({
    name: baseSchemas.name,
    settings: z.record(z.any()).optional().refine(
      (data) => {
        if (!data) return true;
        const sanitized = sanitizeJsonData(data);
        return JSON.stringify(sanitized).length < 50000; // 50KB limit
      },
      { message: 'Settings data too large' }
    ),
  }),
  update: z.object({
    name: baseSchemas.name.optional(),
    settings: z.record(z.any()).optional(),
  }),
};

/**
 * Validation wrapper factory for services
 */
export function createValidatedServiceMethod<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  serviceMethod: (validatedData: TInput) => Promise<TOutput>
) {
  return async (data: unknown): Promise<TOutput> => {
    return withValidation(schema, data, serviceMethod, {
      sanitize: true,
      showToast: false, // Let services handle their own toast messages
    });
  };
}

/**
 * Batch validation helper
 */
export async function validateBatchData<T>(
  schema: z.ZodSchema<T>,
  dataArray: unknown[]
): Promise<{ valid: T[]; errors: Array<{ index: number; error: string }> }> {
  const valid: T[] = [];
  const errors: Array<{ index: number; error: string }> = [];

  for (let i = 0; i < dataArray.length; i++) {
    try {
      const sanitized = sanitizeJsonData(dataArray[i]);
      const validated = await schema.parseAsync(sanitized);
      valid.push(validated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMsg = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        errors.push({ index: i, error: errorMsg });
      } else {
        errors.push({ index: i, error: 'Unknown validation error' });
      }
    }
  }

  return { valid, errors };
}
