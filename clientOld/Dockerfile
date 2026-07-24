FROM node:lts-alpine AS builder

ENV CI=true

RUN corepack enable

WORKDIR /app

COPY . .
RUN pnpm install --frozen-lockfile && pnpm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist ./
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]