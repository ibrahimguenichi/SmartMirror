#!/bin/bash

# Stop and remove any existing Mailpit container
if [ "$(docker ps -aq -f name=mailpit)" ]; then
    echo "Stopping and removing existing Mailpit container..."
    docker stop mailpit >/dev/null 2>&1
    docker rm mailpit >/dev/null 2>&1
fi

# Run Mailpit container
echo "Starting Mailpit container..."
docker run -d \
  --name mailpit \
  -p 8025:8025 \
  -p 1025:1025 \
  axllent/mailpit

echo "Mailpit is now running."
echo "Web UI: http://localhost:8025"
