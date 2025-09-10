#!/usr/bin/env python3
"""
Cache management utility for VFB backend.
Provides commands to clean up expired cache files and view cache statistics.
"""

import argparse
import os
import sys
from pathlib import Path

# Add the parent directory to the path so we can import our modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from virtual_fly_brain.services.cache_utils import term_info_cache, queries_cache

def get_cache_stats(cache_instance, cache_name):
    """Get statistics for a cache instance."""
    cache_dir = cache_instance.cache_dir
    
    if not cache_dir.exists():
        return {
            'name': cache_name,
            'total_files': 0,
            'total_size_mb': 0,
            'expired_files': 0
        }
    
    total_files = 0
    total_size = 0
    expired_files = 0
    
    for cache_file in cache_dir.glob("*.json"):
        try:
            total_files += 1
            total_size += cache_file.stat().st_size
            
            # Check if expired
            import json
            with open(cache_file, 'r', encoding='utf-8') as f:
                cache_data = json.load(f)
            
            if cache_instance._is_expired(cache_data):
                expired_files += 1
                
        except (json.JSONDecodeError, OSError):
            expired_files += 1  # Count corrupted files as expired
    
    return {
        'name': cache_name,
        'total_files': total_files,
        'total_size_mb': round(total_size / (1024 * 1024), 2),
        'expired_files': expired_files
    }

def print_stats():
    """Print cache statistics."""
    term_stats = get_cache_stats(term_info_cache, "Term Info Cache")
    queries_stats = get_cache_stats(queries_cache, "Queries Cache")
    
    print("VFB Cache Statistics")
    print("=" * 50)
    
    for stats in [term_stats, queries_stats]:
        print(f"\n{stats['name']}:")
        print(f"  Total files: {stats['total_files']}")
        print(f"  Total size: {stats['total_size_mb']} MB")
        print(f"  Expired files: {stats['expired_files']}")
        print(f"  Cache directory: {term_info_cache.cache_dir if stats['name'] == 'Term Info Cache' else queries_cache.cache_dir}")

def cleanup_expired():
    """Clean up expired cache files."""
    print("Cleaning up expired cache files...")
    
    term_removed = term_info_cache.cleanup_expired()
    queries_removed = queries_cache.cleanup_expired()
    
    print(f"Removed {term_removed} expired term info cache files")
    print(f"Removed {queries_removed} expired queries cache files")
    print(f"Total files removed: {term_removed + queries_removed}")

def clear_all():
    """Clear all cache files."""
    print("Clearing all cache files...")
    
    term_removed = term_info_cache.clear_all()
    queries_removed = queries_cache.clear_all()
    
    print(f"Removed {term_removed} term info cache files")
    print(f"Removed {queries_removed} queries cache files")
    print(f"Total files removed: {term_removed + queries_removed}")

def main():
    parser = argparse.ArgumentParser(description="VFB Cache Management Utility")
    parser.add_argument("action", choices=["stats", "cleanup", "clear"], 
                       help="Action to perform")
    
    args = parser.parse_args()
    
    if args.action == "stats":
        print_stats()
    elif args.action == "cleanup":
        cleanup_expired()
    elif args.action == "clear":
        clear_all()

if __name__ == "__main__":
    main()
