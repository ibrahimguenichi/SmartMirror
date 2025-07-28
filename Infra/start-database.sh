#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

# Check for Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker and try again."
  exit 1
fi

# Determine the correct docker-compose command
if command -v docker-compose &> /dev/null; then
  COMPOSE_COMMAND="docker-compose"
elif docker compose version &> /dev/null; then
  COMPOSE_COMMAND="docker compose"
else
  echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
  exit 1
fi

# Load .env if it exists
if [ -f ".env" ]; then
  echo "🟢 Loading environment variables from .env"
  # Properly export variables from .env (skip comments and empty lines)
  set -a
  source .env
  set +a
else
  echo "⚠️  Warning: .env not found. Using defaults or inline variables."
fi

# Start Docker containers
echo "🟢 Starting PostgreSQL container using $COMPOSE_COMMAND..."
$COMPOSE_COMMAND up -d

echo "⏳ Waiting for database to initialize..."

# Wait for PostgreSQL to be ready (timeout after 30 seconds)
for i in {1..30}; do
  if docker exec SmartMirror-db pg_isready -U "${DB_USER:-postgres}" > /dev/null 2>&1; then
    echo "✅ PostgreSQL is ready."
    break
  fi
  echo "⏳ Waiting... ($i)"
  sleep 1
done

# Check if PostgreSQL is still not ready after the loop
if ! docker exec SmartMirror-db pg_isready -U "${DB_USER:-postgres}" > /dev/null 2>&1; then
  echo "❌ PostgreSQL failed to start within 30 seconds."
  exit 1
fi

# Ensure pgvector extension exists
echo "🛠️  Creating pgvector extension if needed..."
docker exec SmartMirror-db psql -U "${DB_USER:-postgres}" -d "${DB_NAME:-smartmirror}" -c "CREATE EXTENSION IF NOT EXISTS vector;"

echo "✅ PostgreSQL container is up and running with pgvector."