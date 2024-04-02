import vfbquery as vfb

def run_query(id, query_type):
    # TODO: this will have to be extended to handle a list of ids as params
    try:
        data = vfb.get_term_info(id)
        queries = data['Queries']
        to_run = next((query for query in queries if query['query'] == query_type), None)
        if to_run:
            func = getattr(vfb, to_run['function'])
            return func(id,return_dataframe=False)
        else:
            return ""
    except Exception as e:
        return str(e)
