FROM node:20-slim AS builder
WORKDIR /app

# Install build dependencies
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    python3 \
    build-essential \
    pkg-config \
    libssl-dev \
    openssl \
  && rm -rf /var/lib/apt/lists/*

# Copy the entire workspace
COPY . .

# Install all dependencies
RUN npm install

# Generate Prisma client, build API and compile seed script
RUN npm run generate --prefix apps/api \
    && npm run build --prefix apps/api \
    && cd apps/api/scripts \
    && npx tsc --project tsconfig.json

FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install required runtime dependencies
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    openssl \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/scripts ./scripts
COPY apps/api/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 4000

CMD ["./docker-entrypoint.sh"]
