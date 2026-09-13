#!/bin/bash
# Nani Systems V1 - Development Launcher (macOS/Linux)

echo -e "\033[0;36mStarting Nani Systems V1 Development Environment...\033[0m"

# Check if something is already running on port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "\033[0;33mA service is already running on port 3000.\033[0m"
    echo -e "\033[0;32mAssuming Next.js dev server is already active. Opening browser...\033[0m"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:3000"
    else
        xdg-open "http://localhost:3000"
    fi
    exit 0
fi

# Check if node modules are installed
if [ ! -d "node_modules" ]; then
    echo -e "\033[0;33mInstalling dependencies...\033[0m"
    npm install
fi

# Start the Next.js development server in the background
echo -e "\033[0;33mStarting Next.js dev server...\033[0m"
npm run dev &
DEV_PID=$!

# Wait for the server to be ready
echo -e "\033[0;33mWaiting for server to become available on http://localhost:3000...\033[0m"
SERVER_READY=false
MAX_RETRIES=30
RETRY_COUNT=0

while [ "$SERVER_READY" = false ] && [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    sleep 1
    if curl -s http://localhost:3000 > /dev/null; then
        SERVER_READY=true
    fi
    RETRY_COUNT=$((RETRY_COUNT+1))
done

if [ "$SERVER_READY" = true ]; then
    echo -e "\033[0;32mServer is ready! Opening browser...\033[0m"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open "http://localhost:3000"
    else
        xdg-open "http://localhost:3000"
    fi
    echo -e "\033[0;36mPress Ctrl+C to stop the development server.\033[0m"
    wait $DEV_PID
else
    echo -e "\033[0;31mFailed to connect to the development server after 30 seconds.\033[0m"
    kill $DEV_PID
    exit 1
fi
