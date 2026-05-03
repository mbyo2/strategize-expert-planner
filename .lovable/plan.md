# App Audit & Roadmap — May 2026

## ✅ Implemented (working features)

### Auth & Identity
- SimpleAuth (email/password, signup, forgot/reset password)
- MFA verify flow (`/mfa-verify`)
- Role-based access (viewer/analyst/manager/admin) via `user_roles`
- Organization context + organization members + invitations (hashed tokens)

### Strategic Planning Core
- **Dashboard** (`/`) — KPI tiles, widgets, customizable layout
- **Strategic Goals** (`/goals`) — CRUD, comments, attachments, progress
- **Strategy** (`/strategy`) — Plans (Kanban + timeline), check-ins, rollups *(just built)*
- **Planning** (`/planning`) — Initiatives, milestones, reviews
- **Decision Log** (`/decisions`) — Options, pros/cons, sign-offs
- **Board Packs** (`/board-packs`) — Snapshots, publish via share slug, public view
- **Public Strategy** (`/public-strategy/:slug`) — Read-only board pack viewer

### Analytics & Intelligence
- **Analytics** (`/analytics`) — Strategic charts, dashboards
- **Industry** (`/industry`) — Competitors, SWOT, market changes, metrics

### ERP Suite
- **ERP** (`/erp`) — 28 industry templates, 8 core modules, onboarding wizard
- Industry starter packs, entity dialog, strategic bindings

### Tactical (Defense Domain)
- **Tactical Map** (`/tactical-map`) — Units, drones, threats, AI recommendations
- Battlefield Command Center, Crowd Monitoring, Surveillance

### Org / Admin
- **Teams** (`/teams`) — CRUD, members, invitations
- **Organization** / **OrganizationManagement** — Settings, members
- **User Management** (`/user-management`) — Admin role assignment
- **Admin** (`/admin`) — Security, MFA, sessions, audit
- **Settings**, **Profile**, **Support** (tickets), **Resources**

### Infrastructure
- Real-time subscriptions across most domains
- Audit logs, activity logs, notifications (bell + center)
- Data import/export dialogs, report generator
- i18n (en/es), accessibility menu, theme provider
- Vitest tests (auth, org context, services)

---

## ⚠️ Partially Implemented (stubs or thin)

| Area | File | Issue |
|---|---|---|
| AI Operations | `pages/AIOperations.tsx` (17 LOC) | Just renders `AIOperationsCenter` — verify panel completeness |
| Data Foundry | `pages/DataFoundry.tsx` (17 LOC) | Thin wrapper over `DataFoundry` component |
| Infrastructure | `pages/Infrastructure.tsx` (52 LOC) | Cache/DB/Offline/System monitor exist but no real telemetry source |
| Integrations | `pages/Integrations.tsx` | UI for connectors, but no real OAuth/webhook backends wired |
| Export utils | `utils/exportUtils.ts:105` | Comment says "placeholder that shows a toast" — actual export missing |
| Auth service | `services/authService.ts:150` | "Returns mock data based on user ID patterns" |
| Teams hook | `hooks/useTeams.tsx:157` | Email-to-user lookup is a placeholder |
| Notifications | Email channel | `EmailNotificationService` exists; no edge function wired |
| Help / Onboarding tour | components exist | Not surfaced consistently across pages |
| Calendar integration | `CalendarIntegration.tsx` | UI only, no provider OAuth |

---

## ❌ Not Yet Implemented

### Backend / Edge Functions
- **No edge functions deployed** — all AI, email, export workflows are client-side
- **AI Gateway integration** — chat, summaries, document Q&A advertised but not wired to Lovable AI
- **Email sending** — invitation/notification emails not actually delivered
- **PDF generation** — board pack export to PDF is client-side stub
- **Scheduled jobs** — no cron for digest emails, session cleanup, etc.

### Data & Files
- **No storage buckets** — avatar uploads, attachments, board pack PDFs have no storage
- **Goal attachments** table exists but no upload UI to bucket
- **Document parsing / RAG** — Data Foundry hints at it but no implementation

### Payments / Billing
- Orders table + Stripe scaffolding exist (`PaymentSimulator.tsx`)
- No real Stripe checkout edge function, no subscription tier enforcement

### Collaboration
- Real-time collaboration component exists but cursors/presence not wired
- Comments support but no @mentions / notifications
- No shared editing for board packs / strategy plans

### Search
- `searchService.ts` exists but no global search UI or full-text index

### Mobile
- Mobile navigation component exists; app not deeply tested on mobile

### Security gaps (from memory)
- 70 linter warnings outstanding (SECURITY DEFINER functions executable by anon)
- MFA enforcement per-org configurable but not enforced at login

---

## 🎯 Suggested Priorities

1. **Wire Lovable AI Gateway** — biggest unlock; powers AI Ops, summaries, recommendations
2. **Edge functions for email + PDF** — invitations, board packs actually deliverable
3. **Storage buckets** — avatars + goal attachments + board pack PDFs
4. **Stripe edge function** — if monetization is real
5. **Global search** — once data volume grows, becomes critical
6. **Lock down SECURITY DEFINER warnings** — revoke anon execute
7. **Mobile pass** — many dialogs & dashboards need touch tuning

---

## 📊 Stats
- 33 pages, ~9,100 LOC of pages
- ~30 DB tables with RLS
- 0 edge functions deployed
- 0 storage buckets
- Test coverage: 5 test files (auth, org, services)
