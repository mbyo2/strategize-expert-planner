import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface FormErrorProps {
  title?: string;
  message: string;
  severity?: 'error' | 'warning' | 'info';
  className?: string;
}

/**
 * Reusable form error/warning component
 * Provides consistent error display across all forms
 */
export const FormError: React.FC<FormErrorProps> = ({
  title,
  message,
  severity = 'error',
  className,
}) => {
  const icons = {
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const variants = {
    error: 'destructive',
    warning: 'default',
    info: 'default',
  } as const;

  const Icon = icons[severity];

  return (
    <Alert variant={variants[severity]} className={className}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export interface FormErrorListProps {
  errors: Array<{ field?: string; message: string }>;
  title?: string;
  className?: string;
}

/**
 * Displays a list of validation errors
 */
export const FormErrorList: React.FC<FormErrorListProps> = ({
  errors,
  title = 'Please correct the following errors:',
  className,
}) => {
  if (errors.length === 0) return null;

  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="list-disc list-inside space-y-1 mt-2">
          {errors.map((error, index) => (
            <li key={index}>
              {error.field && <span className="font-semibold">{error.field}: </span>}
              {error.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};
