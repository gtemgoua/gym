#!/usr/bin/env sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL is not set" >&2
  exit 1
fi

echo "Setting up database schema..."
npx prisma db push --skip-generate --force-reset

if [ "$RUN_SEED" = "true" ]; then
  echo "Seeding database..."
  node dist/scripts/seed.js
fi

echo "Starting API server..."
exec node dist/server.js
