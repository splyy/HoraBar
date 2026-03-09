#!/bin/bash
set -e

APP_NAME="KronoBar"

echo "Installing dependencies..."
npm install

echo "Building the application..."
npm run make

SETUP_FILE=$(find out/make/squirrel.windows -name "*Setup.exe" | head -1)
if [ -z "$SETUP_FILE" ]; then
  echo "Setup file not found"
  exit 1
fi

echo "Launching installer..."
echo "The installer will create shortcuts in the Start Menu and on the Desktop."
cmd //c "$(cygpath -w "$SETUP_FILE")"

echo "$APP_NAME installed successfully!"
