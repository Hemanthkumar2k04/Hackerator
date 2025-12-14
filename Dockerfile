# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app/frontend

# Copy package files for better caching
COPY frontend/package.json frontend/package-lock.json* ./

# Install dependencies - use npm install as fallback if no lock file exists
RUN npm install --no-cache --legacy-peer-deps --prefer-offline --no-audit

# Copy the rest of the application code
COPY frontend/ .

# Build the application
RUN npm run build

# Production Stage
FROM nginx:1.25-alpine

# Copy built assets from builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
