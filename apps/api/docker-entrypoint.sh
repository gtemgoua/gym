#!/bin/sh#!/usr/bin/env sh

set -e

# Run Prisma migrations

npx prisma migrate deployif [ -z "$DATABASE_URL" ]; then

  echo "DATABASE_URL is not set" >&2

# Run seed script if RUN_SEED is true  exit 1

if [ "$RUN_SEED" = "true" ]; thenfi

  node scripts/seed.js

fiecho "Setting up database schema..."

npx prisma db push --skip-generate --force-reset

# Start the app

node dist/server.jsif [ "$RUN_SEED" = "true" ]; then
  echo "Seeding database..."
  node dist/scripts/seed.js
fi

echo "Starting API server..."
exec node dist/server.js
