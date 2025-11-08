import { useState, useCallback } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';

export interface ValidationError {
  field: string;
  message: string;
}

export interface UseFormValidationResult<T> {
  errors: ValidationError[];
  isValidating: boolean;
  validate: (data: unknown) => Promise<T | null>;
  clearErrors: () => void;
  setFieldError: (field: string, message: string) => void;
}

/**
 * Custom hook for form validation with Zod schemas
 * Provides comprehensive error handling and user feedback
 */
export function useFormValidation<T>(
  schema: z.ZodSchema<T>,
  options?: {
    showToastOnError?: boolean;
    customErrorMessages?: Record<string, string>;
  }
): UseFormValidationResult<T> {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors((prev) => {
      const filtered = prev.filter((err) => err.field !== field);
      return [...filtered, { field, message }];
    });
  }, []);

  const validate = useCallback(
    async (data: unknown): Promise<T | null> => {
      setIsValidating(true);
      clearErrors();

      try {
        const validated = await schema.parseAsync(data);
        setIsValidating(false);
        return validated;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const validationErrors: ValidationError[] = error.errors.map((err) => ({
            field: err.path.join('.'),
            message: options?.customErrorMessages?.[err.path.join('.')] || err.message,
          }));

          setErrors(validationErrors);

          if (options?.showToastOnError !== false) {
            const errorMessage = validationErrors.length === 1
              ? validationErrors[0].message
              : `${validationErrors.length} validation errors found`;
            
            toast.error('Validation Error', {
              description: errorMessage,
            });
          }
        } else {
          console.error('Unexpected validation error:', error);
          toast.error('Validation Failed', {
            description: 'An unexpected error occurred during validation',
          });
        }

        setIsValidating(false);
        return null;
      }
    },
    [schema, options, clearErrors]
  );

  return {
    errors,
    isValidating,
    validate,
    clearErrors,
    setFieldError,
  };
}

/**
 * Hook for async validation with debouncing
 * Useful for real-time validation as user types
 */
export function useDebouncedValidation<T>(
  schema: z.ZodSchema<T>,
  debounceMs: number = 300
) {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const validateDebounced = useCallback(
    (data: unknown) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      setIsValidating(true);

      const newTimeoutId = setTimeout(async () => {
        try {
          await schema.parseAsync(data);
          setErrors([]);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const validationErrors: ValidationError[] = error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            }));
            setErrors(validationErrors);
          }
        } finally {
          setIsValidating(false);
        }
      }, debounceMs);

      setTimeoutId(newTimeoutId);
    },
    [schema, debounceMs, timeoutId]
  );

  return {
    errors,
    isValidating,
    validateDebounced,
  };
}

/**
 * Validates data against a schema and returns a formatted error message
 */
export function getValidationError<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): string | null {
  try {
    schema.parse(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Validation failed';
    }
    return 'An unexpected error occurred';
  }
}
