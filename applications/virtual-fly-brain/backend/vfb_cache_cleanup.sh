#!/bin/bash
# VFB Cache Cleanup Job
# This script cleans up expired cache files and can be run as a cron job

# Set working directory to the application root
cd /usr/src/app

# Run cache cleanup using the installed Python environment
python3 -m virtual_fly_brain.services.cache_manager cleanup

# Log the cleanup with timestamp
echo "$(date): VFB cache cleanup completed" >> /var/log/vfb_cache_cleanup.log
