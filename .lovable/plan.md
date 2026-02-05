
# Implementation Plan: Missing & Incomplete Features

## Overview

This plan addresses the identified gaps in the application where pages currently use hardcoded mock data instead of real database integration. The implementation will connect existing UI to Supabase, enable data persistence, and add full CRUD functionality across multiple pages.

---

## Phase 1: Planning Page - Database Integration

**Current State:** Uses hardcoded `useState` arrays for initiatives and reviews
**Target State:** Full integration with `usePlanningInitiatives` hook and database

### Changes Required

**File: `src/pages/Planning.tsx`**
- Replace static `useState([...])` with `usePlanningInitiatives()` hook
- Add loading and empty states
- Implement initiative creation dialog
- Implement review scheduling with a new hook/service
- Connect "New Initiative" and "Schedule Review" buttons to actual functionality

**New Files:**
- `src/hooks/useStrategyReviews.tsx` - Hook for managing strategy reviews
- `src/services/strategyReviewsService.ts` - Service layer for reviews CRUD
- `src/components/Planning/InitiativeFormDialog.tsx` - Form for creating/editing initiatives
- `src/components/Planning/ReviewFormDialog.tsx` - Form for scheduling reviews

**Database:** Verify `planning_initiatives` table exists and has proper RLS policies

---

## Phase 2: Profile Page - Persistence

**Current State:** Changes only stored in local state, not persisted to database
**Target State:** Full profile persistence using existing `profileService`

### Changes Required

**File: `src/pages/Profile.tsx`**
- Import and use `fetchUserProfile` and `updateUserProfile` from profileService
- Load profile data on mount using user ID from session
- Update `handleSaveProfile` to call `updateUserProfile`
- Add loading states during save operations
- Sync local state with database on changes
- Handle notification and security preference persistence

**Profile Fields Mapping:**
```text
Local State Field     -> Database Column
-----------------     -----------------
name                  -> name
email                 -> email
phone                 -> (add to profiles or store elsewhere)
location              -> (add to profiles or use company field)
jobTitle              -> job_title
department            -> department
company               -> company
bio                   -> bio
notifications.*       -> email_notifications, app_notifications, weekly_digest
security.mfaEnabled   -> mfa_enabled
security.sessionTimeout -> session_timeout_minutes
```

---

## Phase 3: Analytics Page - Real Data

**Current State:** Hardcoded chart data and static metrics
**Target State:** Dynamic data from strategic goals, initiatives, and team metrics

### Changes Required

**File: `src/pages/Analytics.tsx`**
- Import `useStrategicGoals` and `usePlanningInitiatives` hooks
- Calculate real metrics:
  - Goal completion rate from goals data
  - Active initiatives count
  - Progress trends over time
- Add date range filtering functionality
- Implement export report feature

**New File: `src/hooks/useAnalyticsData.ts`**
- Aggregate data from multiple sources
- Calculate quarterly performance
- Generate trend data from goal progress history

---

## Phase 4: Admin Page - Database Integration

**Current State:** Mock user list and audit logs
**Target State:** Real data from profiles and audit_logs tables

### Changes Required

**File: `src/pages/Admin.tsx`**
- Fetch users from `profiles` table
- Fetch audit logs from `audit_logs` table
- Calculate real system stats from database counts
- Implement user management actions (already partially exists in UserManagement)
- Connect to real backup status (if available)

**Integration:**
- Use existing `UserManagementService` for user operations
- Query `audit_logs` table for recent activity

---

## Phase 5: Organization Page - Database Integration

**Current State:** Hardcoded employee count and department list
**Target State:** Real organization data from database

### Changes Required

**File: `src/pages/Organization.tsx`**
- Use `useOrganizations` hook for organization data
- Use `useTeams` hook for department/team counts
- Fetch member counts from `organization_members` table
- Implement department creation/management
- Connect "Add Department" button to team creation

---

## Phase 6: Industry Page - Database Integration

**Current State:** Mock metrics, market changes, and competitor data
**Target State:** Real industry intelligence from database

### Changes Required

**File: `src/pages/Industry.tsx`**
- Use `useIndustryMetrics` hook (already exists)
- Connect to `industry_metrics` and `market_changes` tables
- Implement CRUD for competitors
- Add real-time updates for market changes

**Verification:** Check if `industry_metrics` and `market_changes` tables exist in schema

---

## Phase 7: User Invitation System

**Current State:** "Send Invitation" button shows toast but doesn't work
**Target State:** Functional invitation system with email

### Changes Required

**File: `src/pages/UserManagement.tsx`**
- Replace TODO with actual invitation logic
- Create invitation record in `organization_invitations` table
- Generate secure token for invitation link

**New Edge Function: `supabase/functions/send-invitation/index.ts`**
- Send invitation email using Resend
- Include secure acceptance link
- Handle email validation

**Note:** Email sending requires Resend API key configuration

---

## Phase 8: Settings Page - Persistence

**Current State:** Settings only in local state
**Target State:** Settings persisted to database

### Changes Required

**File: `src/pages/Settings.tsx`**
- Create settings service for organization-level settings
- Persist app settings to user's profile (`language`, `timezone`, `theme`, `date_format`)
- Persist organization settings to `organizations` table settings JSON column
- Add save buttons and loading states

---

## Technical Details

### Database Tables Used
- `profiles` - User profile data
- `planning_initiatives` - Planning initiatives
- `strategy_reviews` - Review sessions (may need creation)
- `audit_logs` - System audit trail
- `activity_logs` - User activities
- `organizations` - Organization data
- `organization_members` - Membership
- `teams` - Departments/teams
- `strategic_goals` - Goals data
- `organization_invitations` - Invitations

### Hooks to Create/Modify
1. `useStrategyReviews` - For review management
2. `useAnalyticsData` - Aggregated analytics
3. Modify `useOrganizations` - Add member counts

### Components to Create
1. `InitiativeFormDialog` - Planning initiative form
2. `ReviewFormDialog` - Strategy review scheduling form
3. Enhanced loading/empty states across all pages

---

## Implementation Order (Recommended)

1. **Profile persistence** - Foundational, affects user experience
2. **Planning page** - High visibility, existing hook ready
3. **Analytics page** - Depends on goals/initiatives data
4. **Admin page** - Uses existing services
5. **Organization page** - Uses existing hooks
6. **Industry page** - May need table verification
7. **Settings persistence** - Lower priority
8. **Invitation system** - Requires email setup (Resend API key)

---

## Estimated Changes

| Category | Files Changed | New Files |
|:---------|:-------------|:----------|
| Pages | 7 | 0 |
| Hooks | 2 | 3 |
| Services | 1 | 2 |
| Components | 0 | 3 |
| Edge Functions | 0 | 1 |
| **Total** | **10** | **9** |

---

## Prerequisites

1. Verify all referenced database tables exist
2. Confirm RLS policies allow authenticated users to access their data
3. For invitation emails: User must provide Resend API key
