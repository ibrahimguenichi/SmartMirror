# =========================
# Makefile for SmartMirror Dev
# =========================

# Load environment variables from .env
include .env
export

DOCKER_COMPOSE=docker compose -f docker-compose.yml

# -------------------------
# Help
# -------------------------
.PHONY: help
help:
	@echo "Usage:"
	@echo "  make build             # Build all Docker images"
	@echo "  make up                # Start all containers (Backend, AI, Postgres)"
	@echo "  make down              # Stop all containers"
	@echo "  make restart           # Restart all containers"
	@echo "  make logs              # Show logs of all containers"
	@echo "  make logs-backend      # Show logs of the Spring Boot backend"
	@echo "  make logs-ai           # Show logs of the FastAPI AI service"
	@echo "  make logs-postgres     # Show logs of Postgres"
	@echo "  make up-backend        # Start only the Spring Boot backend"
	@echo "  make up-ai             # Start only the FastAPI AI service"
	@echo "  make up-postgres       # Start only the Postgres database"
	@echo "  make urls              # Show available dev interfaces"
	@echo "  make db-shell          # Connect to Postgres dev database"

# -------------------------
# Build all Docker images
# -------------------------
.PHONY: build
build:
	@echo "🔧 Building Docker images..."
	$(DOCKER_COMPOSE) build

# -------------------------
# Start all containers
# -------------------------
.PHONY: up
up:
	@echo "🚀 Starting SmartMirror stack..."
	$(DOCKER_COMPOSE) up -d
	@$(MAKE) urls

# -------------------------
# Stop all containers
# -------------------------
.PHONY: down
down:
	@echo "🛑 Stopping SmartMirror stack..."
	$(DOCKER_COMPOSE) down

# -------------------------
# Restart all containers
# -------------------------
.PHONY: restart
restart: down up

# -------------------------
# Logs
# -------------------------
.PHONY: logs
logs:
	@echo "📄 Showing logs for all services..."
	$(DOCKER_COMPOSE) logs -f

.PHONY: logs-backend
logs-backend:
	@echo "📄 Showing logs for Spring Boot backend..."
	$(DOCKER_COMPOSE) logs -f backend

.PHONY: logs-ai
logs-ai:
	@echo "📄 Showing logs for FastAPI AI service..."
	$(DOCKER_COMPOSE) logs -f ai

.PHONY: logs-postgres
logs-postgres:
	@echo "📄 Showing logs for Postgres..."
	$(DOCKER_COMPOSE) logs -f postgres

# -------------------------
# Start individual services
# -------------------------
.PHONY: up-backend
up-backend:
	@echo "🚀 Starting Spring Boot backend..."
	$(DOCKER_COMPOSE) up -d backend
	@$(MAKE) urls

.PHONY: up-ai
up-ai:
	@echo "🚀 Starting FastAPI AI service..."
	$(DOCKER_COMPOSE) up -d ai
	@$(MAKE) urls

.PHONY: up-postgres
up-postgres:
	@echo "🚀 Starting Postgres..."
	$(DOCKER_COMPOSE) up -d postgres

# -------------------------
# Show available interfaces
# -------------------------
.PHONY: urls
urls:
	@echo ""
	@echo "🌐 Available development interfaces:"
	@echo "  - Spring Boot Backend: http://localhost:${SPRING_APP_PORT}"
	@echo "  - FastAPI AI Service:  http://localhost:${FASTAPI_PORT}"
	@echo "  - Postgres DB:         localhost:${DB_PORT} (db=${DB_NAME}, user=${DB_USER})"
	@echo ""

# -------------------------
# Connect to Postgres DB
# -------------------------
.PHONY: db-shell
db-shell:
	@echo "🐘 Connecting to Postgres database..."
	$(DOCKER_COMPOSE) exec postgres psql -U $$DB_USER -d $$DB_NAME
