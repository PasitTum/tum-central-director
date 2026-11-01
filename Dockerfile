# Multi-stage Dockerfile for TUM Central Director (Sovereign Agent IDE & Daemon)
# Build Stage
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json tsconfig.json ./
RUN npm ci

COPY src ./src
COPY tests ./tests
RUN npm run build

# Production Runtime Stage
FROM node:22-alpine AS runner
WORKDIR /app

RUN apk add --no-cache git

ENV NODE_ENV=production
ENV PORT=5432
ENV TUM_ROOT=/workspace

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/renderer ./src/renderer

EXPOSE 5432

HEALTHCHECK --interval=20s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:5432/api/fleet/health || exit 1

USER node
CMD ["node", "dist/main/daemon.js"]
