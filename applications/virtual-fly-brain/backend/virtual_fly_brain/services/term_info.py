import vfbquery as vfb
from .cache_utils import term_info_cache

def get_term_info(id):
    try:
        # Try to get data from cache first
        cache_key = f"term_info_{id}"
        cached_data = term_info_cache.get(cache_key)
        
        if cached_data is not None:
            # Return cached data
            return cached_data
        
        # If not in cache, fetch from vfbquery API
        data = vfb.get_term_info(id)
        
        # Cache the result
        term_info_cache.set(cache_key, data)
        
        return data
    except Exception as e:
        return str(e)
