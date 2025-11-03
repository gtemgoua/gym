# Gym & Studio Management SaaS

Production-minded starter for a gym, martial-arts school, and fitness studio management platform. The stack is TypeScript end-to-end with a modular backend, shared packages, and a React admin/member UI.

## Highlights

- **Domain-driven backend** (`apps/api`) with Express + Prisma and clear modules for members, billing, scheduling, access, and analytics.
- **Postgres schema** aligned with the MVP data model (memberships, billing, classes, attendance, CRM, messaging, access control).
- **Shared packages** for UI components, navigation config, and validation helpers.
- **Seed data** for a demo tenant including owner, staff, sample members, plans, and templates.
- **OpenAPI spec** for core endpoints under `docs/openapi.yaml`.
- **Dockerfile** for containerizing the API, plus scripts for migrations and seeding.

## Monorepo Structure

```
apps/
  api/         # REST API, Prisma schema, workers, seeds
  web/         # React SPA for admin, staff, member (to be implemented)
packages/
  config/      # Shared navigation and app config
  shared/      # Shared DTOs + zod schemas
  ui/          # Reusable React UI primitives
docs/
  openapi.yaml
```

## Getting Started

1. **Install dependencies** (this auto-installs API & web packages via the `postinstall` hook)

   ```bash
   npm install
   ```

   If the hook is skipped, run `npm run bootstrap` to install `apps/api` and `apps/web` manually.

2. **Environment variables**

   ```bash
   cp apps/api/.env.example apps/api/.env
   # Adjust DATABASE_URL, Stripe/Postmark keys, etc.
   ```

3. **Database**

   ```bash
   npm run db:push
   npm run seed
   ```

4. **Run the API**

   ```bash
   npm run dev:api
   ```

   The server listens on `http://localhost:4000`. Health check at `/health`.

5. **Run the Web App**

   ```bash
   npm run dev:web
   ```

## Testing

```bash
npm run test
```

Back-end tests use Vitest. Add unit coverage around billing rules, booking eligibility, and API handlers within `apps/api/tests`.

## Containerized Stack

Spin up Postgres, API, and the React app behind Nginx with a single command:

```bash
docker compose up --build
```

- App available at `http://localhost:8080`
- API reachable at `http://localhost:8080/api`
- Adjust secrets (JWT, Stripe, email) in `docker-compose.yml` before production use.
- Set `RUN_SEED=true` on the `api` service if you want the demo data seeded on start.

Stop everything with `docker compose down` (add `-v` to drop the Postgres volume).

## Deployment

- Build API container: `docker build -t gym-api ./apps/api`
- Build Web container: `docker build -t gym-web ./apps/web`
- Zero-downtime deploys via standard rolling update; run `prisma migrate deploy` pre-release.

## Next Steps

- Flesh out the React app inside `apps/web`.
- Add background job workers for billing retries, dunning, and report scheduling.
- Expand Stripe webhook handling and integrate Postmark for transactional email delivery.
- Implement real access controller adapters and Phase 2 features (multi-location, SMS, payroll, etc.).
