import React from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ValidationFeedbackProps {
  status: 'idle' | 'validating' | 'valid' | 'invalid';
  message?: string;
  className?: string;
}

/**
 * Visual feedback component for real-time validation
 * Shows loading, success, or error states
 */
export const ValidationFeedback: React.FC<ValidationFeedbackProps> = ({
  status,
  message,
  className,
}) => {
  if (status === 'idle') return null;

  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm',
        status === 'validating' && 'text-muted-foreground',
        status === 'valid' && 'text-green-600 dark:text-green-500',
        status === 'invalid' && 'text-destructive',
        className
      )}
    >
      {status === 'validating' && <Loader2 className="h-4 w-4 animate-spin" />}
      {status === 'valid' && <CheckCircle2 className="h-4 w-4" />}
      {status === 'invalid' && <AlertCircle className="h-4 w-4" />}
      {message && <span>{message}</span>}
    </div>
  );
};

export interface FieldValidationProps {
  isValid?: boolean;
  isValidating?: boolean;
  error?: string;
  successMessage?: string;
}

/**
 * Inline validation feedback for form fields
 */
export const FieldValidation: React.FC<FieldValidationProps> = ({
  isValid,
  isValidating,
  error,
  successMessage,
}) => {
  if (isValidating) {
    return (
      <ValidationFeedback status="validating" message="Validating..." />
    );
  }

  if (error) {
    return <ValidationFeedback status="invalid" message={error} />;
  }

  if (isValid && successMessage) {
    return <ValidationFeedback status="valid" message={successMessage} />;
  }

  return null;
};
