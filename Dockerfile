# Build stage
FROM nginx:alpine AS builder

# Install necessary tools for building if needed
RUN apk add --no-cache nodejs npm

# Set working directory
WORKDIR /app

# Copy all files
COPY . .

# Build the application (if needed - in this case, we just copy static files)
# No build step required for vanilla HTML/CSS/JS

# Production stage
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]