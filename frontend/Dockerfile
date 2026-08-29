# Stage 1: Build the React Application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency catalogs
COPY package.json package-lock.json ./

# Install packages
RUN npm ci

# Copy code
COPY . .

# Set build argument for API URL prefix (defaults to relative path /api/v1 for reverse proxying)
ARG VITE_API_BASE_URL=/api/v1
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Build assets
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:1.25-alpine

# Copy static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
