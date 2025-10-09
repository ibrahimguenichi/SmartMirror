# Use the official Ollama image as the base
FROM ollama/ollama

# Pull the Mistral model during the image build process
# This ensures the model is available when the container starts

# 1. Start 'ollama serve' in the background (&)
# 2. Wait a moment (sleep) for the server to initialize
# 3. Pull the model
# 4. Kill the server process when done (optional, build step terminates anyway)
RUN /bin/sh -c "ollama serve & \
    sleep 5 && \
    ollama pull mistral"

# Expose the default Ollama API port
EXPOSE 11434

# Command to run Ollama in serve mode when the container starts
CMD ["ollama", "serve"]