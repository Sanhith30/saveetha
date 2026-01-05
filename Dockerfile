# Multi-stage build for production deployment

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Stage 2: Setup Node.js backend
FROM node:18-alpine AS backend
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Copy built frontend to backend public directory
COPY --from=frontend-build /app/client/build ./public

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start the application
CMD ["npm", "start"]