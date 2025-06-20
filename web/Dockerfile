FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

RUN apk add --no-cache git

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY web/ ./web/

RUN pnpm install --filter web...

WORKDIR /app/web

EXPOSE 3000

CMD ["pnpm", "run", "dev"]
