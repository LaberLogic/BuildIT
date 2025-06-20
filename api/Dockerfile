FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm
RUN apk add --no-cache git

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY api/ ./api/
COPY shared/ ./shared/

RUN pnpm install

RUN pnpm --filter=api prisma:generate

WORKDIR /app/api

EXPOSE 3001

CMD ["pnpm", "run", "dev"]
