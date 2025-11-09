FROM node:20-slim AS builder
WORKDIR /app

# Install build dependencies
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/config/package*.json ./packages/config/
COPY apps/api/package*.json ./apps/api/
COPY tsconfig*.json ./

# Install dependencies
RUN npm ci && npm install -g prisma

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/config ./packages/config
COPY apps/api ./apps/api

# Build the app
WORKDIR /app/apps/api
RUN npm run generate \
    && npm run build \
    && cd scripts \
    && npx tsc --project tsconfig.json

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package*.json ./
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/scripts/dist ./scripts
COPY apps/api/docker-entrypoint.sh ./

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 4000

CMD ["./docker-entrypoint.sh"]
