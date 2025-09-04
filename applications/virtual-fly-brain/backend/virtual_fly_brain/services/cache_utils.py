import os
import json
import time
import hashlib
from pathlib import Path
from typing import Any, Optional
from virtual_fly_brain.services.numpy_encoder import NumpyEncoder

class DiskCache:
    """
    A disk-based cache with TTL (time-to-live) support.
    Data is stored as JSON files with metadata for expiration tracking.
    """
    
    def __init__(self, cache_dir: str = "/tmp/vfb_cache", ttl_days: int = 3):
        """
        Initialize the disk cache.
        
        Args:
            cache_dir: Directory to store cache files
            ttl_days: Time to live in days (default 3 days)
        """
        self.cache_dir = Path(cache_dir)
        self.ttl_seconds = ttl_days * 24 * 60 * 60  # Convert days to seconds
        
        # Create cache directory if it doesn't exist
        self.cache_dir.mkdir(parents=True, exist_ok=True)
    
    def _get_cache_path(self, key: str) -> Path:
        """Get the file path for a cache key."""
        # Use MD5 hash to create a safe filename
        key_hash = hashlib.md5(key.encode()).hexdigest()
        return self.cache_dir / f"{key_hash}.json"
    
    def _is_expired(self, cache_data: dict) -> bool:
        """Check if cached data has expired."""
        if 'timestamp' not in cache_data:
            return True
        
        current_time = time.time()
        return (current_time - cache_data['timestamp']) > self.ttl_seconds
    
    def get(self, key: str) -> Optional[Any]:
        """
        Retrieve data from cache.
        
        Args:
            key: Cache key
            
        Returns:
            Cached data if available and not expired, None otherwise
        """
        cache_path = self._get_cache_path(key)
        
        if not cache_path.exists():
            return None
        
        try:
            with open(cache_path, 'r', encoding='utf-8') as f:
                cache_data = json.load(f)
            
            if self._is_expired(cache_data):
                # Remove expired cache file
                cache_path.unlink()
                return None
            
            # Update timestamp on access (refresh TTL)
            cache_data['timestamp'] = time.time()
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, ensure_ascii=False, cls=NumpyEncoder)
            
            return cache_data['data']
            
        except (json.JSONDecodeError, KeyError, OSError) as e:
            # If cache file is corrupted, remove it
            if cache_path.exists():
                cache_path.unlink()
            return None
    
    def set(self, key: str, data: Any) -> None:
        """
        Store data in cache.
        
        Args:
            key: Cache key
            data: Data to cache
        """
        cache_path = self._get_cache_path(key)
        
        cache_data = {
            'timestamp': time.time(),
            'data': data
        }
        
        try:
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, ensure_ascii=False, cls=NumpyEncoder)
        except OSError as e:
            # If we can't write to cache, just continue without caching
            pass
    
    def cleanup_expired(self) -> int:
        """
        Remove all expired cache files.
        
        Returns:
            Number of files removed
        """
        removed_count = 0
        
        for cache_file in self.cache_dir.glob("*.json"):
            try:
                with open(cache_file, 'r', encoding='utf-8') as f:
                    cache_data = json.load(f)
                
                if self._is_expired(cache_data):
                    cache_file.unlink()
                    removed_count += 1
                    
            except (json.JSONDecodeError, OSError):
                # Remove corrupted files
                cache_file.unlink()
                removed_count += 1
        
        return removed_count
    
    def clear_all(self) -> int:
        """
        Remove all cache files.
        
        Returns:
            Number of files removed
        """
        removed_count = 0
        
        for cache_file in self.cache_dir.glob("*.json"):
            try:
                cache_file.unlink()
                removed_count += 1
            except OSError:
                pass
        
        return removed_count


# Global cache instances
term_info_cache = DiskCache(cache_dir="/tmp/vfb_cache/term_info", ttl_days=3)
queries_cache = DiskCache(cache_dir="/tmp/vfb_cache/queries", ttl_days=3)
