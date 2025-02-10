#!/bin/bash

# Wait for PostgreSQL to be available
/wait-for-it.sh ${DB_HOST}:${DB_PORT} --timeout=60 --strict -- echo "Postgres is up!"

# Run migrations
echo "Running migrations..."
npm run typeorm -- migration:run -d ./src/data-source.ts

# Start the Node.js application
echo "Starting the app..."
npm run dev
