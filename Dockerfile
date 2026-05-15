# Build stage - build the Vite frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine
WORKDIR /app

# Copy package files and install ALL deps (tsx needed to run TS server)
COPY package*.json ./
RUN npm ci

# Copy built frontend and server source
COPY --from=builder /app/dist ./dist
COPY server ./server
COPY shared ./shared
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.server.json ./tsconfig.server.json

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

# Use tsx with tsconfig-paths for @/ alias resolution
CMD ["npx", "tsx", "--tsconfig", "tsconfig.server.json", "server/index.ts"]
