#!/bin/bash

# Start cron service in the background
service cron start

# Create cache directories with proper permissions
mkdir -p /tmp/vfb_cache/term_info /tmp/vfb_cache/queries
chmod 755 /tmp/vfb_cache /tmp/vfb_cache/term_info /tmp/vfb_cache/queries

# Start the main application
exec "$@"
