FROM alpine:latest

# Install dependencies
RUN apk add --no-cache curl bash

# Download ngrok (replace with your version if needed)
RUN wget https://bin.equinox.io/c/4VmDzA7iaHb/ngrok-stable-linux-amd64.zip \
    && unzip ngrok-stable-linux-amd64.zip \
    && mv ngrok /usr/local/bin/ \
    && rm ngrok-stable-linux-amd64.zip

# Copy start script
COPY start-ngrok.sh /start-ngrok.sh
RUN chmod +x /start-ngrok.sh

# Run script
CMD ["/start-ngrok.sh"]
