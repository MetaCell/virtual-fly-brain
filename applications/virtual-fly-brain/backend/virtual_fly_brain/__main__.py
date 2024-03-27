#from cloudharness.utils.server import init_flask
import vfbquery as vfb
from cloudharness.utils.server import init_flask
import flask
from flask import request
from flask_cors import CORS, cross_origin
import os
import json
import numpy as np

class NumpyEncoder(json.JSONEncoder):
    """ Custom encoder for numpy data types """
    def default(self, obj):
        if isinstance(obj, (np.int_, np.intc, np.intp, np.int8,
                            np.int16, np.int32, np.int64, np.uint8,
                            np.uint16, np.uint32, np.uint64)):

            return int(obj)

        elif isinstance(obj, (np.float_, np.float16, np.float32, np.float64)):
            return float(obj)

        elif isinstance(obj, (np.complex_, np.complex64, np.complex128)):
            return {'real': obj.real, 'imag': obj.imag}

        elif isinstance(obj, (np.ndarray,)):
            return obj.tolist()

        elif isinstance(obj, (np.bool_)):
            return bool(obj)

        elif isinstance(obj, (np.void)): 
            return None

        return json.JSONEncoder.default(self, obj)
def init_webapp_routes(app):
    @app.route('/get_instances', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def instances():
      return vfb.get_instances(request.args.get('short_form'))

    @app.route('/get_term_info', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def term_info():
      id = request.args.get('id')
      data = vfb.get_term_info(id)
      data_formatted = json.dumps(data, cls=NumpyEncoder)
      return data_formatted
    
    @app.route('/get_queries', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def get_queries():
      queries = vfb.get_instances(request.args.get('short_form'), return_dataframe=False)
      info_data = json.dumps(queries, cls=NumpyEncoder)
      return info_data

app = init_flask(title="VFB index API", webapp=True, init_app_fn=init_webapp_routes)

def main():
  # CORS(app, support_credentials=True)
  app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    main()
