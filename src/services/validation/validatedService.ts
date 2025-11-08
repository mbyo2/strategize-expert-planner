import { z } from 'zod';
import { toast } from 'sonner';
import { sanitizeJsonData } from './sanitization';

/**
 * Wrapper for service methods that validates input before processing
 */
export async function withValidation<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  data: unknown,
  serviceMethod: (validatedData: TInput) => Promise<TOutput>,
  options?: {
    sanitize?: boolean;
    showToast?: boolean;
    errorMessage?: string;
  }
): Promise<TOutput> {
  try {
    // Sanitize if requested
    const dataToValidate = options?.sanitize ? sanitizeJsonData(data) : data;
    
    // Validate against schema
    const validatedData = await schema.parseAsync(dataToValidate);
    
    // Execute service method with validated data
    return await serviceMethod(validatedData);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      
      if (options?.showToast !== false) {
        toast.error('Validation Error', {
          description: options?.errorMessage || errorMessages,
        });
      }
      
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    
    // Re-throw non-validation errors
    throw error;
  }
}

/**
 * Validates and sanitizes data before database insertion
 */
export async function validateForInsert<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  // Sanitize JSONB fields
  const sanitized = sanitizeJsonData(data);
  
  // Validate
  const result = await schema.safeParseAsync(sanitized);
  
  if (!result.success) {
    const errors = result.error.errors
      .map((err) => `${err.path.join('.')}: ${err.message}`)
      .join(', ');
    
    throw new Error(`Data validation failed: ${errors}`);
  }
  
  return result.data;
}

/**
 * Validates and sanitizes data before database update
 */
export async function validateForUpdate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  return validateForInsert(schema, data);
}

/**
 * Batch validation for multiple records
 */
export async function validateBatch<T>(
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

/**
 * Creates a type-safe service wrapper with automatic validation
 */
export function createValidatedService<TInput, TOutput>(
  schema: z.ZodSchema<TInput>,
  serviceMethod: (data: TInput) => Promise<TOutput>
) {
  return async (data: unknown): Promise<TOutput> => {
    return withValidation(schema, data, serviceMethod, {
      sanitize: true,
      showToast: true,
    });
  };
}
