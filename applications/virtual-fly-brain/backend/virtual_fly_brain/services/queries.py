import vfbquery as vfb
from .cache_utils import queries_cache, term_info_cache

def run_query(id, query_type):
    # TODO: this will have to be extended to handle a list of ids as params
    try:
        # Validate query_type - it must be provided and not None or 'undefined'
        if query_type is None or query_type == 'undefined' or query_type == '':
            raise ValueError("query_type parameter is required and must be a valid query type. Use get_term_info endpoint to retrieve available queries.")
        
        # Create a unique cache key for the query
        cache_key = f"query_{id}_{query_type}"
        cached_data = queries_cache.get(cache_key)
        
        if cached_data is not None:
            # Return cached query data
            return cached_data
        
        # Get term info (this will also use caching)
        term_info_cache_key = f"term_info_{id}"
        data = term_info_cache.get(term_info_cache_key)
        
        if data is None:
            # If term info not in cache, fetch it
            data = vfb.get_term_info(id)
            term_info_cache.set(term_info_cache_key, data)
        
        queries = data['Queries']
        to_run = next((query for query in queries if query['query'] == query_type), None)
        
        if to_run is not None:
            func = getattr(vfb, to_run['function'])
            data_queries = func(id, return_dataframe=False)
            data_queries['label'] = to_run['label']
            data_queries['Tags'] = data['Tags']
            
            # Cache the query result
            queries_cache.set(cache_key, data_queries)
            
            return data_queries
        else:
            raise ValueError(f"Query type '{query_type}' not found for instance '{id}'")
            
    except Exception as e:
        return {"error": str(e)}
