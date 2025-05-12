
FROM node:18

WORKDIR /app

# Install PNPM globally
RUN npm install -g pnpm

# Copy the root package.json and pnpm-lock.yaml to install dependencies
COPY package.json 


# Install only dependencies for web workspace
RUN pnpm install --filter web...

# Copy the rest of your application files into the container (from ./web to /app)
COPY . /app

EXPOSE 3000

CMD ["npm", "run", "dev"]
