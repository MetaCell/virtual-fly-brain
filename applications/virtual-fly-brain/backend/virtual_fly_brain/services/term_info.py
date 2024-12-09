import vfbquery as vfb

def get_term_info(id):
    try:
        data = vfb.get_term_info(id)
        return data
    except Exception as e:
        return str(e)
