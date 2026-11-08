#!/bin/sh
set -eu

cd "$(dirname "$0")"
port="${PORT:-8000}"

echo "Serving Little Moments on port ${port}."
echo "On this Mac: http://localhost:${port}/"
echo "On your iPhone, use your Mac's Wi-Fi IP: http://<mac-ip>:${port}/"
echo "Press Ctrl+C to stop the server."

exec python3 -m http.server "$port" --bind 0.0.0.0
