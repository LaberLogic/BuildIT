#!/bin/bash
set -e


docker compose -f ../docker-compose.test.yml up -d

pnpm run schema:change

npx jest -runInBand --detectOpenHandles

cd ..
docker compose -f docker-compose.test.yml down
