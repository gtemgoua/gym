## Architecture Overview

### High-Level Components

- **API (`apps/api`)** – Node.js + Express + Prisma. Organized into feature modules (`members`, `billing`, `classes`, etc.) with shared error handling, auth middleware, and rate limiting.
- **Web (`apps/web`)** – React + Vite SPA served separately. Uses TanStack Query for data fetching, shared UI kit (`@gym/ui`), and config-driven navigation.
- **Shared Packages**
  - `@gym/config`: navigation map and cross-frontend configuration.
  - `@gym/shared`: DTOs and zod schemas reused in the API and web layers.
  - `@gym/ui`: headless UI primitives styled with Tailwind utility classes.

### Data Flow

1. React SPA authenticates via `/api/auth/login`, stores JWT, and attaches it to future requests.
2. API validates auth via middleware, checks roles & scopes, and routes requests to feature modules.
3. HTTP handlers delegate to service files that encapsulate Prisma data access and domain rules.
4. Prisma models map directly to Postgres tables defined in `prisma/schema.prisma`.
5. Background tasks (dunning, analytics email) are planned as future workers triggered by webhooks or cron.

### Key Modules

- **Members**: CRUD, status transitions, waiver capture, shared member status enum (`MemberStatus`).
- **Billing**: Invoices, payments, exports, Stripe webhook skeleton, audit logging.
- **Scheduling**: Class templates, events, bookings with waitlist promotion and ICS feed generation.
- **Attendance**: Eligibility engine and check-in logging for kiosk/staff/API.
- **CRM**: Leads pipeline, activities, and messaging template management.
- **Access Control**: Allowed member feed, manual override, webhook placeholder for door sync.
- **Analytics**: Today dashboard, KPI metrics, class fill rate, attendance cohorts.

### Security & Compliance

- Rate limiting, CORS, Helmet, centralized error handling.
- JWT auth with role- & scope-aware guards.
- No card data stored; Stripe handles PCI via hosted flows.
- Audit logging on sensitive actions (subscriptions, bookings, access).
- Field-level encryption hooks can be layered via Prisma middleware.

### Deployment

- API containerized with `apps/api/Dockerfile`. Terraform stub targets Heroku container deployment.
- Environment variables managed via `.env` templates per service.
- Seed script populates plans, members, templates for demo tenant.

### Testing & Tooling

- Vitest harness configured for API and web.
- ESLint/Prettier enforcing TypeScript best practices.
- Future CI can run `npm test`, lint, and `prisma migrate deploy` prior to build.
