#!/bin/bash
set -e

if [ "$BUILD_BACKEND" == "false" ]; then
    # Serve built static frontend only
    exec serve /usr/src/app/virtual_fly_brain/www --single --listen 8080
else
    # Start cron, prepare cache, run backend
    service cron start
    mkdir -p /tmp/vfb_cache/term_info /tmp/vfb_cache/queries
    chmod 755 /tmp/vfb_cache /tmp/vfb_cache/term_info /tmp/vfb_cache/queries
    exec gunicorn --log-level=info --preload --bind=0.0.0.0:8080 --timeout=240 --graceful-timeout=30 --keep-alive=5 virtual_fly_brain.__main__:app
fi