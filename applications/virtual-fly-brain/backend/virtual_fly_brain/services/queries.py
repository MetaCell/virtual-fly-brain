import vfbquery as vfb

def run_query(id, query_type):
    # TODO: this will have to be extended to handle a list of ids as params
    try:
        data = vfb.get_term_info(id)
        queries = data['Queries']
        to_run = next((query for query in queries if query['query'] == query_type), None)
        if to_run is not None:
            func = getattr(vfb, to_run['function'])
            return func(id,return_dataframe=False)
        else:
            if data['Examples'] is not None:
                return data['Examples']
            elif data['Images'] is not None:
                return data['Images']
    except Exception as e:
        return str(e)
