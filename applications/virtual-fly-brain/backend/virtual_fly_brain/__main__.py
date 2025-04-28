import os
import json
import flask
import werkzeug
import numpy as np
import vfbquery as vfb
from flask_cors import CORS, cross_origin
from services.queries import run_query
from services.term_info import get_term_info

dev_mode = os.getenv('VFB_DEV', True)

# if not dev_mode:
#     from cloudharness.utils.server import init_flask

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
    # if dev_mode:
    www_path = os.path.dirname(os.path.abspath(__file__)) + "/www"

    @app.route('/', methods=['GET'])
    def index():
        return flask.send_from_directory(www_path, 'index.html')

    @app.route('/get_instances', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def instances():
        return vfb.get_instances(flask.request.args.get('short_form'))

    @app.route('/get_term_info', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def term_info():
        id = flask.request.args.get('id')dev_mode
        data = get_term_info(id)
        data_formatted = json.dumps(data, cls=NumpyEncoder)
        return data_formatted

    @app.route('/run_query', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def get_query_results():
        id = flask.request.args.get('id')
        query_type = flask.request.args.get('query_type')
        query_info_data = run_query(id, query_type)
        info_data = json.dumps(query_info_data, cls=NumpyEncoder)
        return info_data

    @app.errorhandler(werkzeug.exceptions.NotFound)
    def handle_not_found(e):
        return {
            'error': 'Page not found'
        }, 404

    @app.errorhandler(werkzeug.exceptions.BadRequest)
    @app.errorhandler(werkzeug.exceptions.InternalServerError)
    def handle_bad_request(e):
        return {
            'error': 'Internal server error'
        }, 500

# app = None
# if dev_mode:
app = flask.Flask(__name__)
CORS(app, support_credentials=True)
init_webapp_routes(app)
# else:
#     app = init_flask(title="Virtual Fly Brain REST API", webapp=True, init_app_fn=init_webapp_routes)

def main():
    app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    main()
