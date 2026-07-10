# Multi-stage Dockerfile cho Next.js
FROM node:20-alpine AS base

# 1. Cài đặt dependencies chỉ khi cần thiết
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Sao chép package.json và package-lock.json để cài đặt thư viện
COPY package.json package-lock.json* ./
RUN npm ci

# 2. Rebuild mã nguồn của ứng dụng
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Vô hiệu hóa tính năng thu thập dữ liệu ẩn danh của Next.js trong quá trình build
ENV NEXT_TELEMETRY_DISABLED=1

# Các biến môi trường cần thiết khi build (sẽ truyền vào thông qua docker-compose args)
ARG NEXT_PUBLIC_SITE_URL
ARG API_BASE_URL
ARG NEXT_PUBLIC_API_ASSET_URL
ARG NEXT_PUBLIC_ENABLE_VNPAY

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV API_BASE_URL=$API_BASE_URL
ENV NEXT_PUBLIC_API_ASSET_URL=$NEXT_PUBLIC_API_ASSET_URL
ENV NEXT_PUBLIC_ENABLE_VNPAY=$NEXT_PUBLIC_ENABLE_VNPAY

RUN npm run build

# 3. Môi trường chạy sản phẩm (Production image)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Cấp quyền ghi cho Next.js cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Sao chép các tệp standalone đã được tối ưu hóa từ builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Khởi chạy Next.js standalone server
CMD ["node", "server.js"]
