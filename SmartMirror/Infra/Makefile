# Path to your start-db script
START_DB_SCRIPT := ./start-database.sh

# Name of the Docker container
DB_CONTAINER := test_postgres_db

# Default env file
ENV_FILE := .env.dev

# Targets
.PHONY: db-up db-down db-logs db-status db-restart db-shell

## Start the local PostgreSQL database container
db-up:
	@echo "🟢 Starting local database container..."
	$(START_DB_SCRIPT)

## Stop and remove the database container
db-down:
	@echo "🔴 Stopping and removing database container..."
	-docker stop $(DB_CONTAINER)
	-docker rm $(DB_CONTAINER)

## Show logs from the database container
db-logs:
	@echo "📜 Showing logs from $(DB_CONTAINER)..."
	docker logs -f $(DB_CONTAINER)

## Check the status of the database container
db-status:
	@docker ps -a --filter "name=$(DB_CONTAINER)"

## Restart the database container
db-restart:
	@echo "🔄 Restarting database container..."
	-docker restart $(DB_CONTAINER)

## Open an interactive psql shell
db-shell:
	@echo "🧪 Connecting to Postgres shell..."
	docker exec -it $(DB_CONTAINER) psql -U $$(grep DB_USER $(ENV_FILE) | cut -d '=' -f2) -d $$(grep DB_NAME $(ENV_FILE) | cut -d '=' -f2)
