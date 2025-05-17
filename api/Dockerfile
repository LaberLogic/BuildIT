FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY api/package.json ./api/package.json api/prisma/

RUN pnpm install --filter api...

COPY . .

RUN pnpm --filter=api prisma:generate

WORKDIR /app/api

EXPOSE 3001

CMD ["pnpm", "run", "dev"]
