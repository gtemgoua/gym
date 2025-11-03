FROM node:20-slim AS builder
WORKDIR /app

# Copy root workspace files
COPY . .

# Install all dependencies including dev dependencies
RUN npm install

# Install additional build dependencies
RUN cd apps/web && npm install -D autoprefixer postcss

# Install app-specific dependencies (resolve local file: packages and external deps)
RUN npm install --prefix apps/web
 
# Ensure workspace package dependencies are installed too (so imports from packages/ui resolve)
RUN npm install --prefix packages/ui

# Build the app
RUN npm run build --prefix apps/web

FROM nginx:1.25-alpine AS runner

COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
