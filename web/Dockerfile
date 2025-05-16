FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY web/ ./web/

RUN pnpm install --filter web...

WORKDIR /app/web


EXPOSE 3000

CMD ["pnpm", "run", "dev"]
