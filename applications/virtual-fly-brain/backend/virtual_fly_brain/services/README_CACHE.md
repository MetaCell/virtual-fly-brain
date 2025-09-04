# VFB Disk-Based Caching System

This directory contains the disk-based caching implementation for the Virtual Fly Brain backend services. The caching system improves performance by storing frequently accessed data on disk and reducing calls to the vfbquery API.

## Features

- **Disk-based storage**: Uses local disk storage instead of memory to avoid pod memory limitations
- **TTL (Time To Live)**: Cached data expires after 3 days by default
- **TTL refresh**: Accessing cached data refreshes its expiration time
- **Automatic cleanup**: Provides utilities to clean up expired cache files
- **Separate caches**: Different cache instances for term info and queries
- **Error handling**: Gracefully handles corrupted cache files and I/O errors

## Files

- `cache_utils.py`: Core caching implementation with the `DiskCache` class
- `term_info.py`: Updated term info service with caching support
- `queries.py`: Updated queries service with caching support  
- `cache_manager.py`: Command-line utility for cache management
- `vfb_cache_cleanup.sh`: Shell script for automated cache cleanup (can be used with cron)

## Cache Storage

Cache files are stored in:
- Term info: `/tmp/vfb_cache/term_info/`
- Queries: `/tmp/vfb_cache/queries/`

Each cache entry is stored as a JSON file with:
```json
{
    "timestamp": 1693747200.0,
    "data": { ... }
}
```

## Usage

### Cache Management Commands

```bash
# Activate the environment
conda activate vfbtest

# View cache statistics
python3 -m virtual_fly_brain.services.cache_manager stats

# Clean up expired cache files
python3 -m virtual_fly_brain.services.cache_manager cleanup

# Clear all cache files
python3 -m virtual_fly_brain.services.cache_manager clear
```

## Deployment

### Docker/Kubernetes Deployment

The caching system is automatically configured in the Docker container:

1. **Cron job**: Automatically set up to run daily cleanup at 2 AM
2. **Cache directories**: Created automatically on container startup
3. **Log file**: Cache cleanup logs written to `/var/log/vfb_cache_cleanup.log`

The Docker container includes:
- Cron service running in background
- Cache cleanup script at `/usr/local/bin/vfb_cache_cleanup.sh`
- Automatic cache directory creation with proper permissions

### Local Development

For local development with conda environment:

```bash
# Activate the environment
conda activate vfbtest

# View cache statistics
python3 -m virtual_fly_brain.services.cache_manager stats

# Clean up expired cache files
python3 -m virtual_fly_brain.services.cache_manager cleanup
```

### Manual Cleanup (if needed)

In the Docker container, you can manually run cleanup:

```bash
# Inside the container
/usr/local/bin/vfb_cache_cleanup.sh

# Or using the Python module
python3 -m virtual_fly_brain.services.cache_manager cleanup
```

### Service Integration

The caching is automatically integrated into the existing services:

- `get_term_info(id)`: Checks cache first, then falls back to vfbquery API
- `run_query(id, query_type)`: Caches both term info and query results

## Configuration

### Cache TTL

The default TTL is 3 days. To change this, modify the `ttl_days` parameter when creating cache instances in `cache_utils.py`:

```python
term_info_cache = DiskCache(cache_dir="/tmp/vfb_cache/term_info", ttl_days=7)  # 7 days
```

### Cache Directory

To change the cache directory, modify the `cache_dir` parameter:

```python
term_info_cache = DiskCache(cache_dir="/custom/cache/path/term_info", ttl_days=3)
```

## Performance Benefits

- **Reduced API calls**: Subsequent requests for the same data are served from cache
- **Faster response times**: Disk I/O is typically faster than network API calls
- **Reduced load**: Less load on the vfbquery API servers
- **TTL refresh**: Frequently accessed data stays cached longer

## Error Handling

The caching system is designed to be fault-tolerant:

- **API failures**: If caching fails, the original data is still returned
- **Corrupted cache files**: Automatically removed on next access
- **I/O errors**: Gracefully handled without affecting the application
- **Missing directories**: Automatically created as needed

## Monitoring

Use the cache manager to monitor cache performance:

```bash
python3 -m virtual_fly_brain.services.cache_manager stats
```

This shows:
- Number of cached files
- Total cache size
- Number of expired files
- Cache directories

## Testing

The caching system has been tested with:
- Basic set/get operations
- TTL expiration and refresh
- Cleanup of expired files
- Integration with existing services
- Error handling scenarios
