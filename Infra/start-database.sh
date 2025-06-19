#!/usr/bin/env bash

if ! command -v docker &> /dev/null; then
  echo "Docker is not installed. Please install Docker and try again."
  exit 1
fi

# Check for either docker-compose or docker compose
if command -v docker-compose &> /dev/null; then
  COMPOSE_COMMAND="docker-compose"
elif docker compose version &> /dev/null; then
  COMPOSE_COMMAND="docker compose"
else
  echo "Docker Compose is not installed. Please install Docker Compose and try again."
  exit 1
fi

if [ -f ".env.dev" ]; then
  echo "Loading environment variables from .env.dev"
  export $(grep -v '^#' .env.dev | xargs)
else
  echo "Warning: .env.dev not found. Make sure you have it for DB credentials."
fi

echo "Starting PostgreSQL container using $COMPOSE_COMMAND..."
$COMPOSE_COMMAND up -d
if [ $? -ne 0 ]; then
  echo "Failed to start containers. Exiting."
  exit 1
fi

echo "Waiting for database to initialize..."

# Wait for Postgres to be ready (max 30 seconds)
for i in {1..30}; do
  docker exec SmartMirror-db pg_isready -U "$DB_USER" > /dev/null 2>&1 && break
  echo "Waiting for PostgreSQL to be ready... ($i)"
  sleep 1
done

# Check if pgvector is installed, if not create extension
echo "Ensuring pgvector extension is available..."
docker exec SmartMirror-db psql -U "$DB_USER" -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS vector;"
if [ $? -ne 0 ]; then
  echo "Failed to create pgvector extension."
  exit 1
fi

echo "PostgreSQL container is up and running with pgvector."
