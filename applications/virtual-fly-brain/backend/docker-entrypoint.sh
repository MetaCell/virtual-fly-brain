#!/bin/bash

# Start cron service in the background
service cron start

# Create cache directories with proper permissions
mkdir -p /tmp/vfb_cache/term_info /tmp/vfb_cache/queries
chmod 755 /tmp/vfb_cache /tmp/vfb_cache/term_info /tmp/vfb_cache/queries

# Conditional launch: if backend is disabled, serve frontend only
if [ "$BUILD_BACKEND" == "false" ]; then
    exec serve /usr/src/app/virtual_fly_brain/www --single --listen 8080
else
    exec "$@"
fi