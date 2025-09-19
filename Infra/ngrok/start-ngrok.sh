!/bin/bash

# Start frontend tunnel
ngrok http --url=dinosaur-pet-ladybird.ngrok-free.app 8080 &

# Start backend tunnel
ngrok http --url=minnow-blessed-usually.ngrok-free.app 3000 &

# Keep container running
wait
