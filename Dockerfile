# Multi-stage build for React + Express + Node.js application

# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend

# Copy frontend package files
COPY todolist/package*.json ./
RUN npm install
RUN npm install -D sass sass-embedded

# Copy frontend source code
COPY todolist/ ./

# Build the application (ignore ESLint warnings)
RUN npm run build || (echo "Build failed, checking logs..." && exit 1)

# Stage 2: Setup Express backend
FROM node:18-alpine AS backend
WORKDIR /app

# Copy backend package files
COPY Server/package*.json ./
RUN npm install --production

# Copy backend source code
COPY Server/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/frontend/dist ./public

# Expose port
EXPOSE 3001

# Set environment variables
ENV NODE_ENV=production
ENV MONGODB_URI=mongodb://mongo:27017/TodoList

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
CMD ["node", "index.js"]
