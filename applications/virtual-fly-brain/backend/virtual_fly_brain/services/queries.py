import vfbquery as vfb
from .cache_utils import queries_cache, term_info_cache

def run_query(id, query_type):
    # TODO: this will have to be extended to handle a list of ids as params
    try:
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
            # For queries list, we can also cache this
            result = dict({'queries': queries, 'name': data['Name']})
            queries_cache.set(cache_key, result)
            return result
            
    except Exception as e:
        return str(e)
