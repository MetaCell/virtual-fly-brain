#!/bin/bash

# Only start cron if backend is enabled
if [ "$BUILD_BACKEND" != "false" ]; then
    service cron start
fi

# Create cache directories with proper permissions
mkdir -p /tmp/vfb_cache/term_info /tmp/vfb_cache/queries
chmod 755 /tmp/vfb_cache /tmp/vfb_cache/term_info /tmp/vfb_cache/queries

exec "$@"