import vfbquery as vfb

def run_query(id, query_type):
    try:
        data = vfb.get_term_info(id)
        return ""
    except Exception as e:
        return str(e)
