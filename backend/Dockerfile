FROM node:24-alpine

WORKDIR /app

# Copiar package files
COPY package.json pnpm-lock.yaml ./

RUN corepack enable
RUN npm cache clean --force
RUN pnpm install --frozen-lockfile

COPY .env.example .env

COPY . .

RUN pnpm prisma generate

EXPOSE 3333

# Usar nest start em produção
CMD ["pnpm", "run", "start:migrate:prod"]