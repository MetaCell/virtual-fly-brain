#!/bin/bash
set -e

echo "BUILD_BACKEND=$BUILD_BACKEND"
env | sort | grep BUILD

# Start cron service in the background (only if backend is enabled)
if [ "$BUILD_BACKEND" != "false" ]; then
    service cron start
fi

# Create cache directories with proper permissions
mkdir -p /tmp/vfb_cache/term_info /tmp/vfb_cache/queries
chmod 755 /tmp/vfb_cache /tmp/vfb_cache/term_info /tmp/vfb_cache/queries

# Start the main application
exec "$@"
# Conditional launch: if backend is disabled, serve frontend only
if [ "$BUILD_BACKEND" == "true" ]; then
    exec gunicorn --log-level=info --preload --bind=0.0.0.0:8080 --timeout=240 --graceful-timeout=30 --keep-alive=5 virtual_fly_brain.__main__:app
else
    exec serve /usr/src/app/virtual_fly_brain/www --single --listen 8080
fi