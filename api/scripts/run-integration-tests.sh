#!/bin/bash
set -e


docker-compose -f ../docker-compose.test.yml up -d

echo "Waiting for services to be ready..."


npx jest tests/integration --runInBand --detectOpenHandles

cd ..
docker-compose -f docker-compose.test.yml down
