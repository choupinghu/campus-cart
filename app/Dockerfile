FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

FROM base AS dev
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 5173
EXPOSE 8000
ENV RUN_DB_SEED=false
CMD ["sh", "-c", "pnpm db:push && if [ \"$RUN_DB_SEED\" = \"true\" ]; then pnpm db:seed; fi && pnpm dev"]
