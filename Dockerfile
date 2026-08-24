# Ảnh Docker chạy Next.js trên máy chủ thật.
#
# Chia 3 tầng để ảnh cuối chỉ còn phần cần khi chạy: không có mã nguồn, không
# có node_modules đầy đủ (~500MB), chỉ còn bản đã đóng gói sẵn (~180MB).

# ---------- Tầng 1: cài thư viện ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm ci cài đúng phiên bản trong package-lock, không tự nâng cấp gì
RUN npm ci

# ---------- Tầng 2: build ----------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Địa chỉ API phải có SẴN LÚC BUILD, không phải lúc chạy.
# Next nhúng thẳng biến NEXT_PUBLIC_* vào mã JavaScript gửi xuống trình duyệt,
# nên đặt lúc chạy container là không kịp — trình duyệt vẫn gọi vào localhost.
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ---------- Tầng 3: chạy ----------
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Chạy bằng tài khoản thường, không phải root. Nếu ai đó khai thác được lỗ hổng
# trong Next thì cũng không có quyền root trong container.
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
# .next/standalone đã gói sẵn phần node_modules cần thiết
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

# server.js do next build sinh ra khi bật output: "standalone"
CMD ["node", "server.js"]
