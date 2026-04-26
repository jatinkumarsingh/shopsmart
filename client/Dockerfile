# Build stage
FROM node:24-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage (Nginx)
FROM nginx:alpine AS runner
# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html
# Run nginx
CMD ["nginx", "-g", "daemon off;"]

