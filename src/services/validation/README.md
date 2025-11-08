# Validation System Documentation

This directory contains the comprehensive validation system for the application, providing both client-side and server-side input validation with user-friendly error handling.

## Overview

The validation system consists of:

1. **Zod Schemas** (`schemas.ts`) - Type-safe validation schemas for all data models
2. **Sanitization Utilities** (`sanitization.ts`) - Security-focused input sanitization
3. **Validation Hooks** (`../hooks/useFormValidation.ts`) - React hooks for form validation
4. **Service Validators** (`serviceValidators.ts`) - Pre-validated service methods
5. **Validated Service Wrappers** (`validatedService.ts`) - Utility functions for validation

## Usage

### 1. Form Validation with React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { strategicGoalCreateSchema } from '@/services/validation/schemas';

function MyForm() {
  const form = useForm({
    resolver: zodResolver(strategicGoalCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      // ...
    },
  });

  const onSubmit = async (data) => {
    // Data is already validated by Zod
    await createGoal(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
}
```

### 2. Using Custom Validation Hook

```typescript
import { useFormValidation } from '@/hooks/useFormValidation';
import { strategicGoalCreateSchema } from '@/services/validation/schemas';

function MyComponent() {
  const { validate, errors, isValidating } = useFormValidation(
    strategicGoalCreateSchema,
    { showToastOnError: true }
  );

  const handleSubmit = async (data: unknown) => {
    const validated = await validate(data);
    if (validated) {
      // Data is safe to use
      await createGoal(validated);
    }
  };

  return (
    <div>
      {errors.map((error) => (
        <p key={error.field}>{error.message}</p>
      ))}
    </div>
  );
}
```

### 3. Service-Level Validation

```typescript
import { validatedGoalsService } from '@/services/validation/serviceValidators';

// Automatically validates and sanitizes input
async function createGoal(data: unknown) {
  try {
    const result = await validatedGoalsService.create(data);
    return result;
  } catch (error) {
    // Validation errors are automatically shown in toast
    console.error('Failed to create goal:', error);
  }
}
```

### 4. Manual Validation

```typescript
import { validateForInsert } from '@/services/validation/validatedService';
import { strategicGoalCreateSchema } from '@/services/validation/schemas';

async function processData(data: unknown) {
  try {
    // Validates and sanitizes
    const validated = await validateForInsert(
      strategicGoalCreateSchema,
      data
    );
    
    // Use validated data
    await supabase.from('strategic_goals').insert(validated);
  } catch (error) {
    console.error('Validation failed:', error);
  }
}
```

## Available Schemas

### Strategic Goals
- `strategicGoalCreateSchema` - For creating new goals
- `strategicGoalUpdateSchema` - For updating existing goals

### Planning Initiatives
- `planningInitiativeCreateSchema` - For creating new initiatives
- `planningInitiativeUpdateSchema` - For updating existing initiatives

### Organizations
- `organizationCreateSchema` - For creating organizations
- `organizationUpdateSchema` - For updating organizations
- `organizationMemberSchema` - For managing members
- `organizationSettingsSchema` - For organization settings

### Teams
- `teamCreateSchema` - For creating teams
- `teamUpdateSchema` - For updating teams
- `teamMemberSchema` - For managing team members

### Market Changes
- `marketChangeCreateSchema` - For creating market changes
- `marketChangeUpdateSchema` - For updating market changes

### Support Tickets
- `supportTicketCreateSchema` - For creating support tickets
- `supportTicketUpdateSchema` - For updating support tickets

### ERP Entities
- `erpEntityCreateSchema` - For creating ERP entities (with JSONB injection protection)
- `erpEntityUpdateSchema` - For updating ERP entities

### Common Schemas
- `uuidSchema` - UUID validation
- `emailSchema` - Email validation
- `urlSchema` - URL validation
- `invitationCreateSchema` - For invitations

## Sanitization Functions

Located in `sanitization.ts`:

```typescript
import {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeFileName,
  sanitizeJsonData,
  sanitizeEmail,
  checkRateLimit,
} from '@/services/validation/sanitization';

// HTML sanitization (XSS prevention)
const clean = sanitizeHtml('<script>alert("xss")</script>');

// Text sanitization (removes dangerous characters)
const cleanText = sanitizeText('user input');

// URL validation
const safeUrl = sanitizeUrl('https://example.com');

// JSONB data sanitization
const cleanData = sanitizeJsonData({ user: 'input' });

// Rate limiting (brute force protection)
if (!checkRateLimit('user:123', 5, 60000)) {
  throw new Error('Too many attempts');
}
```

## Error Handling

### Display Validation Errors

```typescript
import { FormError, FormErrorList } from '@/components/ui/form-error';

// Single error
<FormError 
  message="Name is required" 
  severity="error"
/>

// Multiple errors
<FormErrorList 
  errors={[
    { field: 'name', message: 'Name is required' },
    { field: 'email', message: 'Invalid email' },
  ]}
/>
```

### Validation Feedback Component

```typescript
import { ValidationFeedback } from '@/components/ValidationFeedback';

<ValidationFeedback 
  status="validating" // 'idle' | 'validating' | 'valid' | 'invalid'
  message="Checking availability..."
/>
```

## Best Practices

1. **Always validate user input** - Both client-side and server-side
2. **Use centralized schemas** - Don't duplicate validation logic
3. **Sanitize before storage** - Especially for JSONB fields
4. **Show user-friendly errors** - Use toast notifications and inline errors
5. **Validate file uploads** - Check file names, types, and sizes
6. **Rate limit sensitive operations** - Prevent brute force attacks
7. **Log validation failures** - For security monitoring

## Security Features

- **XSS Prevention**: HTML sanitization with DOMPurify
- **SQL Injection Protection**: Input sanitization and parameterized queries (via Supabase)
- **JSONB Injection Prevention**: Pattern detection and sanitization
- **Path Traversal Protection**: File name sanitization
- **Rate Limiting**: Brute force attack prevention
- **Length Limits**: Prevent buffer overflow attacks
- **Type Validation**: Ensure data integrity

## Testing

```typescript
import { getValidationError } from '@/hooks/useFormValidation';
import { strategicGoalCreateSchema } from '@/services/validation/schemas';

// Test validation
const error = getValidationError(strategicGoalCreateSchema, {
  name: '', // Invalid: required field
});

console.log(error); // "Name is required"
```

## Contributing

When adding new validation:

1. Add schema to `schemas.ts`
2. Create validated service in `serviceValidators.ts`
3. Update this documentation
4. Add tests for validation logic
5. Update form components to use the schema

## Migration Guide

### From Old Validation to New System

**Before:**
```typescript
if (!data.name || data.name.length === 0) {
  throw new Error('Name is required');
}
```

**After:**
```typescript
import { strategicGoalCreateSchema } from '@/services/validation/schemas';

const validated = await strategicGoalCreateSchema.parseAsync(data);
// validated is now type-safe and guaranteed to be valid
```

## Performance Considerations

- Validation is synchronous for simple checks
- Use `parseAsync` for async validation (e.g., checking database uniqueness)
- Debounce real-time validation to avoid excessive checks
- Cache validation results when appropriate

## Troubleshooting

### Common Issues

**Issue:** Validation passes but data is incorrect
**Solution:** Check if you're using the correct schema (create vs update)

**Issue:** Errors not showing in UI
**Solution:** Ensure `FormMessage` components are present in form fields

**Issue:** Type errors with validated data
**Solution:** Use `z.infer<typeof schema>` to get the TypeScript type

## Related Documentation

- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [DOMPurify](https://github.com/cure53/DOMPurify)
- [Security Best Practices](../../docs/security.md)
