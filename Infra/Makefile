# =========================
# Makefile for SmartMirror Dev
# =========================

# ---------------------------------------------------------
# Environment
# ---------------------------------------------------------
ifneq ("$(wildcard .env)","")
    include .env
    export $(shell sed 's/=.*//' .env | grep -v '^#')
endif

DOCKER_COMPOSE := docker compose -f docker-compose.yml

# ---------------------------------------------------------
# Help
# ---------------------------------------------------------
.PHONY: help
.PHONY: help
help:
	@echo "Usage:"
	@echo "  make build             # Build all Docker images"
	@echo "  make build-backend     # Build only the Spring Boot backend image"
	@echo "  make build-ai          # Build only the FastAPI AI image"
	@echo "  make build-postgres    # Build only the Postgres image"
	@echo "  make build-ngrok-back  # Build only the Ngrok backend tunnel image"
	@echo "  make build-ngrok-front # Build only the Ngrok frontend tunnel image"
	@echo "  make build-llm         # Build only the LLM image"
	@echo "  make build-redis       # Pull Redis image"
	@echo ""
	@echo "  make up                # Start all containers"
	@echo "  make up-backend        # Start only the backend container"
	@echo "  make up-ai             # Start only the AI container"
	@echo "  make up-postgres       # Start only the Postgres container"
	@echo "  make up-ngrok-back     # Start only the Ngrok backend container"
	@echo "  make up-ngrok-front    # Start only the Ngrok frontend container"
	@echo "  make up-llm            # Start only the LLM container"
	@echo "  make up-redis          # Start only the Redis container"
	@echo ""
	@echo "  make down              # Stop all containers"
	@echo "  make restart           # Restart all containers"
	@echo "  make rebuild           # Build images then restart all containers"
	@echo ""
	@echo "  make ps                # List running containers"
	@echo ""
	@echo "  make logs-<service>    # Show logs (backend, ai, postgres, ngrok-back, ngrok-front, llm, redis)"
	@echo "  make db-shell          # Connect to Postgres dev database"

# ---------------------------------------------------------
# Build
# ---------------------------------------------------------
.PHONY: build
build:
	@echo "🔧 Building all Docker images..."
	$(DOCKER_COMPOSE) build

.PHONY: build-backend
build-backend:
	@echo "🔧 Building backend image..."
	$(DOCKER_COMPOSE) build backend

.PHONY: build-ai
build-ai:
	@echo "🔧 Building AI image..."
	$(DOCKER_COMPOSE) build ai

.PHONY: build-postgres
build-postgres:
	@echo "🔧 Building Postgres image..."
	$(DOCKER_COMPOSE) build postgres

.PHONY: build-ngrok-back
build-ngrok-back:
	@echo "🔧 Building Ngrok backend image..."
	$(DOCKER_COMPOSE) build ngrok_backend

.PHONY: build-ngrok-front
build-ngrok-front:
	@echo "🔧 Building Ngrok frontend image..."
	$(DOCKER_COMPOSE) build ngrok_frontend

# Build + restart everything
.PHONY: rebuild
rebuild: build restart

# ---------------------------------------------------------
# Up / Down / Restart
# ---------------------------------------------------------
.PHONY: up
up:
	@echo "🚀 Starting SmartMirror stack..."
	$(DOCKER_COMPOSE) up -d
	@$(MAKE) urls

.PHONY: down
down:
	@echo "🛑 Stopping SmartMirror stack..."
	$(DOCKER_COMPOSE) down

.PHONY: restart
restart: down up

.PHONY: ps
ps:
	$(DOCKER_COMPOSE) ps

# ---------------------------------------------------------
# Start individual services
# ---------------------------------------------------------
.PHONY: up-backend
up-backend:
	$(DOCKER_COMPOSE) up -d backend
	@$(MAKE) urls

.PHONY: up-ai
up-ai:
	$(DOCKER_COMPOSE) up -d ai
	@$(MAKE) urls

.PHONY: up-postgres
up-postgres:
	$(DOCKER_COMPOSE) up -d postgres

.PHONY: up-ngrok-back
up-ngrok-back:
	$(DOCKER_COMPOSE) up -d ngrok_backend

.PHONY: up-ngrok-front
up-ngrok-front:
	$(DOCKER_COMPOSE) up -d ngrok_frontend

# ---------------------------------------------------------
# Logs
# ---------------------------------------------------------
.PHONY: logs
logs:
	$(DOCKER_COMPOSE) logs -f

.PHONY: logs-backend
logs-backend:
	$(DOCKER_COMPOSE) logs -f backend

.PHONY: logs-ai
logs-ai:
	$(DOCKER_COMPOSE) logs -f ai

.PHONY: logs-postgres
logs-postgres:
	$(DOCKER_COMPOSE) logs -f postgres

.PHONY: logs-ngrok-back
logs-ngrok-back:
	$(DOCKER_COMPOSE) logs -f ngrok_backend

.PHONY: logs-ngrok-front
logs-ngrok-front:
	$(DOCKER_COMPOSE) logs -f ngrok_frontend

# ---------------------------------------------------------
# Show URLs
# ---------------------------------------------------------
.PHONY: urls
urls:
	@echo ""
	@echo "🌐 Available development interfaces:"
	@echo "  - Spring Boot Backend: http://localhost:${SPRING_APP_PORT}"
	@echo "  - FastAPI AI Service:  http://localhost:${FASTAPI_PORT}"
	@echo "  - Postgres DB:         localhost:${DB_PORT} (db=${DB_NAME}, user=${DB_USER})"
	@echo ""

# ---------------------------------------------------------
# Connect to Postgres
# ---------------------------------------------------------
.PHONY: db-shell
db-shell:
	@echo "🐘 Connecting to Postgres database..."
	$(DOCKER_COMPOSE) exec postgres psql -U ${DB_USER} -d ${DB_NAME}

# ---------------------------------------------------------
# Build LLM
# ---------------------------------------------------------
.PHONY: build-llm
build-llm:
	@echo "🔧 Building LLM image..."
	$(DOCKER_COMPOSE) build llm

# ---------------------------------------------------------
# Start LLM
# ---------------------------------------------------------
.PHONY: up-llm
up-llm:
	$(DOCKER_COMPOSE) up -d llm
	@$(MAKE) urls

# ---------------------------------------------------------
# Logs LLM
# ---------------------------------------------------------
.PHONY: logs-llm
logs-llm:
	$(DOCKER_COMPOSE) logs -f llm

# ---------------------------------------------------------
# Build Redis
# ---------------------------------------------------------
.PHONY: build-redis
build-redis:
	@echo "🔧 Pulling Redis image..."
	$(DOCKER_COMPOSE) pull redis

# ---------------------------------------------------------
# Start Redis
# ---------------------------------------------------------
.PHONY: up-redis
up-redis:
	$(DOCKER_COMPOSE) up -d redis
	@echo "✅ Redis container started"

# ---------------------------------------------------------
# Logs Redis
# ---------------------------------------------------------
.PHONY: logs-redis
logs-redis:
	$(DOCKER_COMPOSE) logs -f redis
