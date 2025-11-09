# Gym & Studio Management SaaS

Modernized stack featuring an ASP.NET Core 8 Web API and an Angular 18 admin experience to manage memberships, billing, scheduling, attendance, and analytics for gyms and studios.

## Architecture Overview

- **Backend**: ASP.NET Core 8 Web API (`apps/api`) with EF Core + PostgreSQL. JWT auth, CORS, and modular controllers align with the original API surface so existing clients can migrate smoothly.
- **Frontend**: Angular 18 SPA (`apps/web`) recreating the PulseFit UI—login, dashboard tiles, and resource tables for members, plans, classes, bookings, attendance, leads, and billing.
- **Database**: PostgreSQL via Docker compose. `DataSeeder` seeds demo users, plans, members, and subscriptions for quick demos.
- **Containerization**: Dockerfiles for both services plus a compose stack (`docker-compose.yml`) that wires the API, web app, and database together.

## Prerequisites

- .NET 8 SDK
- Node.js 20+ (for Angular tooling)
- Docker (optional but recommended for local parity)

## Backend Setup (`apps/api`)

```bash
cd apps/api
# restore packages
 dotnet restore
# run EF migrations & seed sample data
 dotnet run
```

The API listens on `http://localhost:4000` by default. Health check: `GET /health`.

Environment configuration lives in `appsettings.json`. Override values via environment variables (`ConnectionStrings__Default`, `Jwt__SecretKey`, etc.).

## Frontend Setup (`apps/web`)

```bash
cd apps/web
npm install
npm run start
```

Angular dev server runs at `http://localhost:4200` and proxies API calls to `/api` (configure via `ng serve --proxy-config` if needed).

## Dockerized Environment

Launch the full stack (Postgres + API + Angular + Nginx proxy) with:

```bash
docker compose up --build
```

- Web UI: `http://localhost:8080`
- API: `http://localhost:8080/api`

Demo credentials from the seed data: `owner@gym.test / ChangeMe123!`

Stop the stack with `docker compose down` (add `-v` to drop the Postgres volume).

## Project Layout

```
apps/
  api/        # ASP.NET Core Web API, EF Core models, seeding
  web/        # Angular 18 SPA
Dockerfile    # per-project Dockerfiles (in each app directory)
docker-compose.yml
```

Key backend directories:

- `Domain/Entities` – EF Core entities mirroring the legacy schema.
- `Infrastructure/AppDbContext.cs` – DbContext + relationships.
- `Controllers/` – Auth, members, plans, analytics, classes, bookings, attendance, leads, billing, and access endpoints.
- `Application/Services` – JWT token factory & supporting DTOs.

Key frontend highlights:

- `app/services` – API + auth utilities, HTTP interceptors.
- `app/pages` – Standalone components for login, dashboard, members, etc.
- `app/routes.ts` – Angular router definitions + auth guard.

## Next Steps

- Flesh out remaining endpoints (subscriptions, messaging, etc.) as needed.
- Wire in production-ready error handling, input validation, and background jobs.
- Expand Angular components with richer forms, filters, and state management.
