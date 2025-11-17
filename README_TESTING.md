# Testing Guide

## Overview

This project includes comprehensive testing infrastructure covering unit tests, integration tests, and security validation.

## Test Structure

```
src/__tests__/
├── components/          # Component tests
├── services/           # Service layer tests
├── hooks/              # Custom hooks tests
├── contexts/           # Context tests
├── integration/        # Integration tests
├── mocks/             # Mock data and handlers
└── setup.ts           # Test configuration
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Watch Mode
```bash
npm run test:watch
```

### Coverage Report
```bash
npm run test:coverage
```

## Test Categories

### 1. Service Layer Tests
- **strategicGoalsService.test.ts**: Strategic goals CRUD with validation
- **planningInitiativesService.test.ts**: Planning initiatives with validation
- **erpService.test.ts**: ERP entity management

Key aspects tested:
- Input validation using Zod schemas
- Data sanitization
- Error handling
- JSONB field size limits

### 2. Authentication Tests
- **useSimpleAuth.test.tsx**: Auth hook functionality
- **auth-flow.test.tsx**: Complete authentication flow

Tests cover:
- Sign in/sign up flows
- Session management
- Role-based access control
- Error handling

### 3. Context Tests
- **OrganizationContext.test.tsx**: Organization management

Tests cover:
- Organization CRUD operations
- Context state management
- User membership validation

### 4. Component Tests
- **AuthGuard.test.tsx**: Route protection
- Form validation components
- Dashboard widgets

## Security Testing

### Input Validation
All service tests verify:
- SQL injection prevention
- XSS protection
- JSONB field size limits
- Required field validation

### Example
```typescript
it('should validate and sanitize input', async () => {
  const maliciousInput = {
    name: '<script>alert("xss")</script>',
    entity_data: {} // Should be validated for size
  };
  
  await expect(createERPEntity(maliciousInput)).rejects.toThrow();
});
```

## Best Practices

### 1. Mock Supabase Client
```typescript
vi.mock('@/integrations/supabase/client');

// In test
vi.mocked(supabase.from).mockReturnValue({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockResolvedValue({ data: mockData, error: null })
} as any);
```

### 2. Test Error Scenarios
```typescript
it('should handle database errors gracefully', async () => {
  vi.mocked(DatabaseService.fetchData).mockRejectedValue(
    new Error('Connection failed')
  );
  
  const result = await fetchData();
  expect(result).toEqual([]);
});
```

### 3. Async Testing
```typescript
it('should fetch data asynchronously', async () => {
  const { result } = renderHook(() => useData());
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  
  expect(result.current.data).toBeDefined();
});
```

## Coverage Goals

- **Overall**: >80%
- **Services**: >90% (critical business logic)
- **Components**: >70%
- **Hooks**: >85%

## Continuous Integration

Tests run automatically on:
- Every commit (unit tests)
- Pull requests (full suite)
- Pre-deployment (integration + security)

## Debugging Tests

### Run Single Test
```bash
npm test -- strategicGoalsService.test.ts
```

### Debug Mode
```bash
npm test -- --inspect-brk
```

### Verbose Output
```bash
npm test -- --reporter=verbose
```

## Adding New Tests

1. Create test file next to source: `*.test.ts` or `*.test.tsx`
2. Import necessary mocks and utilities
3. Group related tests with `describe` blocks
4. Use descriptive test names: `it('should ...')`
5. Follow AAA pattern: Arrange, Act, Assert

Example:
```typescript
describe('MyService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should perform action successfully', async () => {
    // Arrange
    const input = { ... };
    vi.mocked(dependency).mockResolvedValue({ ... });

    // Act
    const result = await myService.action(input);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
```

## Security Test Checklist

- [ ] Input validation for all user inputs
- [ ] JSONB size limits enforced
- [ ] SQL injection protection
- [ ] XSS prevention
- [ ] Authentication required for protected routes
- [ ] Authorization checks for role-based access
- [ ] Secure session management
- [ ] No sensitive data in localStorage
- [ ] RLS policies tested

## Common Issues

### Mock Not Working
- Ensure mock is defined before import
- Check mock path matches exactly
- Use `vi.clearAllMocks()` in `beforeEach`

### Async Test Timeout
- Increase timeout: `{ timeout: 10000 }`
- Check for unresolved promises
- Use `waitFor` for async operations

### Type Errors in Tests
- Use `as any` for complex mocks
- Import proper types from source
- Check test environment types
