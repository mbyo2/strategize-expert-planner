
import { sanitizeInput } from "@/utils/securityUtils";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'email' | 'date' | 'boolean';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
  errorMessage?: string;
}

export const validateData = (data: any, rules: ValidationRule[]): ValidationResult => {
  const errors: string[] = [];
  const sanitizedData: any = {};

  for (const rule of rules) {
    const value = data[rule.field];
    
    // Check required fields
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${rule.field} is required`);
      continue;
    }
    
    // Skip validation if field is not required and empty
    if (!rule.required && (value === undefined || value === null || value === '')) {
      continue;
    }
    
    // Type validation
    if (rule.type) {
      switch (rule.type) {
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${rule.field} must be a string`);
            continue;
          }
          sanitizedData[rule.field] = sanitizeInput(value);
          break;
        case 'number':
          if (typeof value !== 'number' && isNaN(Number(value))) {
            errors.push(`${rule.field} must be a number`);
            continue;
          }
          sanitizedData[rule.field] = Number(value);
          break;
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${rule.field} must be a valid email address`);
            continue;
          }
          sanitizedData[rule.field] = sanitizeInput(value);
          break;
        case 'date':
          if (isNaN(Date.parse(value))) {
            errors.push(`${rule.field} must be a valid date`);
            continue;
          }
          sanitizedData[rule.field] = new Date(value);
          break;
        case 'boolean':
          if (typeof value !== 'boolean') {
            errors.push(`${rule.field} must be a boolean`);
            continue;
          }
          sanitizedData[rule.field] = Boolean(value);
          break;
      }
    } else {
      // If no type specified, sanitize string values
      sanitizedData[rule.field] = typeof value === 'string' ? sanitizeInput(value) : value;
    }
    
    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors.push(`${rule.field} must be at least ${rule.minLength} characters long`);
    }
    
    if (rule.maxLength && value.length > rule.maxLength) {
      errors.push(`${rule.field} must be no more than ${rule.maxLength} characters long`);
    }
    
    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors.push(rule.errorMessage || `${rule.field} format is invalid`);
    }
    
    // Custom validation
    if (rule.customValidator && !rule.customValidator(value)) {
      errors.push(rule.errorMessage || `${rule.field} validation failed`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: errors.length === 0 ? sanitizedData : undefined
  };
};

export const validateStrategicGoal = (data: any): ValidationResult => {
  const rules: ValidationRule[] = [
    { field: 'name', required: true, type: 'string', minLength: 1, maxLength: 255 },
    { field: 'description', type: 'string', maxLength: 1000 },
    { field: 'target_value', type: 'number' },
    { field: 'current_value', type: 'number' },
    { field: 'progress', type: 'number', customValidator: (value) => value >= 0 && value <= 100 },
    { field: 'status', type: 'string', pattern: /^(planned|in_progress|completed|on_hold)$/ },
    { field: 'start_date', type: 'date' },
    { field: 'due_date', type: 'date' },
  ];
  
  return validateData(data, rules);
};

export const validatePlanningInitiative = (data: any): ValidationResult => {
  const rules: ValidationRule[] = [
    { field: 'name', required: true, type: 'string', minLength: 1, maxLength: 255 },
    { field: 'description', type: 'string', maxLength: 1000 },
    { field: 'status', type: 'string', pattern: /^(planning|in_progress|completed|on_hold)$/ },
    { field: 'progress', type: 'number', customValidator: (value) => value >= 0 && value <= 100 },
    { field: 'start_date', type: 'date' },
    { field: 'end_date', type: 'date' },
  ];
  
  return validateData(data, rules);
};

export const validateStrategyReview = (data: any): ValidationResult => {
  const rules: ValidationRule[] = [
    { field: 'title', required: true, type: 'string', minLength: 1, maxLength: 255 },
    { field: 'description', type: 'string', maxLength: 1000 },
    { field: 'scheduled_date', required: true, type: 'date' },
    { field: 'duration_minutes', type: 'number', customValidator: (value) => value > 0 && value <= 480 },
    { field: 'status', type: 'string', pattern: /^(scheduled|in_progress|completed|cancelled)$/ },
  ];
  
  return validateData(data, rules);
};

export const validateMarketChange = (data: any): ValidationResult => {
  const rules: ValidationRule[] = [
    { field: 'title', required: true, type: 'string', minLength: 1, maxLength: 255 },
    { field: 'description', required: true, type: 'string', minLength: 1, maxLength: 2000 },
    { field: 'impact_level', required: true, type: 'string', pattern: /^(low|medium|high)$/ },
    { field: 'source', type: 'string', maxLength: 255 },
    { field: 'category', type: 'string', maxLength: 100 },
    { field: 'date_identified', type: 'date' },
  ];
  
  return validateData(data, rules);
};

export const validateRecommendation = (data: any): ValidationResult => {
  const rules: ValidationRule[] = [
    { field: 'title', required: true, type: 'string', minLength: 1, maxLength: 255 },
    { field: 'description', required: true, type: 'string', minLength: 1, maxLength: 2000 },
    { field: 'priority', type: 'number', customValidator: (value) => value >= 1 && value <= 5 },
    { field: 'status', type: 'string', pattern: /^(pending|approved|rejected|implemented)$/ },
    { field: 'category', type: 'string', maxLength: 100 },
  ];
  
  return validateData(data, rules);
};
