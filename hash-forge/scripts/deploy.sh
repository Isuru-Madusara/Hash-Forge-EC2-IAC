#!/usr/bin/env bash
# Builds Hash Forge for production and previews the output locally.
# Usage: bash scripts/deploy.sh

set -e

echo "Installing dependencies..."
npm install

echo "Building production bundle..."
npm run build

echo "Build complete. Output is in ./dist"
echo "Run 'npm run preview' to serve it locally, or upload ./dist to any static host."
