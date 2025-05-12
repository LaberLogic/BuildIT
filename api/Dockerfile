# Use official Node.js image
FROM node:18

# Set root working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy root workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy only the api workspace (and other workspace manifests if needed)
COPY api/package.json ./api/package.json

# Install only dependencies needed for the api workspace
RUN pnpm install --filter api...

COPY . .

WORKDIR /app/api

EXPOSE 3001

CMD ["pnpm", "run", "dev"]
