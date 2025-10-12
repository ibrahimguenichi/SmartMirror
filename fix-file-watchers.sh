#!/bin/bash

echo "🔧 Fixing file watcher limit for development..."

# Check current limit
echo "Current file watcher limit:"
cat /proc/sys/fs/inotify/max_user_watches

echo ""
echo "Increasing file watcher limit to 524288..."

# Increase the limit temporarily
echo 524288 | sudo tee /proc/sys/fs/inotify/max_user_watches

# Make it permanent
echo "Making the change permanent..."
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

# Apply the changes
sudo sysctl -p

echo ""
echo "✅ File watcher limit increased successfully!"
echo "New limit:"
cat /proc/sys/fs/inotify/max_user_watches

echo ""
echo "🚀 You can now restart your development server."




