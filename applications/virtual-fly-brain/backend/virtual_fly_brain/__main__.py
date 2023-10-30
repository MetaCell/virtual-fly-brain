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
    www_path = os.path.dirname(os.path.abspath(__file__)) + "/www"

    @app.route('/get_term_info', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def term_info():
      id = request.args.get('id')
      term_info_data = vfb.get_term_info(id)
      info_data = json.dumps(term_info_data, cls=NumpyEncoder)
      return info_data

    @app.route('/model_from_id', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def model_from_id():
      pass

    @app.route('/stack_view_images_from_id', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def stack_view_images_from_id():
      pass

    @app.route('/layers_from_id', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def layers_from_id():
      pass

    @app.route('/circuit_browser_from_id', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def circuit_browser_from_id():
      pass

    @app.route('/download_content', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def download_content():
      pass

    @app.route('/loading_manager', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def loading_manager():
      pass

    @app.route('/get_instances', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def instances():
      return get_instances(request.args.get('short_form'))
      
    @app.route('/test', methods=['GET'])
    def test():
      return 'routing ok'

    @app.route('/', methods=['GET'])
    def index():
        return flask.send_from_directory(www_path, 'index.html')

    @app.route('/<path:path>', methods=['GET'])
    def send_webapp(path):
        return flask.send_from_directory(www_path, path)

    @app.errorhandler(404)
    def page_not_found(error):
        # when a 404 is thrown send the "main" index page
        # unless the first segment of the path is in the exception list
        first_segment_path = flask.request.full_path.split('/')[1]
        if first_segment_path in ['api', 'static', 'test']:  # exception list
            return error
        return index()
    
app = init_flask(title="VFB index API", webapp=True, init_app_fn=init_webapp_routes)

def main():
  CORS(app, support_credentials=True)
  init_webapp_routes(app)
  app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    main()