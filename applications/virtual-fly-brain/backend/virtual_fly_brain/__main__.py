import os
import json
import flask
import werkzeug
import numpy as np
import pandas as pd
vfb = None
try:
    import vfbquery as vfb
except ImportError as e:
    print("vfbquery module not found. Please install it using pip.")
from flask_cors import CORS, cross_origin
from virtual_fly_brain.services.queries import run_query
from virtual_fly_brain.services.term_info import get_term_info

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
    @app.route('/', methods=['GET'])
    def index():
        return flask.send_from_directory("www", 'index.html')


    @app.route('/get_instances', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def instances():
        short_form = flask.request.args.get('short_form')
        if not short_form:
            return flask.jsonify({'error': 'Missing required parameter: short_form'}), 400

        try:
            result = vfb.get_instances(short_form)
            if isinstance(result, pd.DataFrame):
                result = result.to_dict(orient='records')
            elif isinstance(result, pd.Series):
                result = result.to_dict()
            return flask.jsonify(result)
        except Exception as e:
            return flask.jsonify({'error': str(e)}), 500


    @app.route('/get_term_info', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def term_info():
        term_id = flask.request.args.get('id')
        if not term_id:
            return flask.jsonify({'error': 'Missing required parameter: id'}), 400
        try:
            data = get_term_info(term_id)
            return flask.Response(
                json.dumps(data, cls=NumpyEncoder),
                mimetype='application/json'
            )
        except Exception as e:
            return flask.jsonify({'error': str(e)}), 500


    @app.route('/run_query', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def get_query_results():
        term_id = flask.request.args.get('id')
        query_type = flask.request.args.get('query_type')
        if not term_id or not query_type:
            return flask.jsonify({'error': 'Missing required parameters: id and/or query_type'}), 400
        try:
            query_info_data = run_query(term_id, query_type)
            return flask.Response(
                json.dumps(query_info_data, cls=NumpyEncoder),
                mimetype='application/json'
            )
        except Exception as e:
            return flask.jsonify({'error': str(e)}), 500


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


www_path = os.path.dirname(os.path.abspath(__file__)) + "/www"
app = flask.Flask(
    __name__,
    static_url_path='',
    static_folder=www_path,
    )
CORS(app, support_credentials=True)
init_webapp_routes(app)
# TODO: fix this to use the init_flask function from cloudharness
#     app = init_flask(title="Virtual Fly Brain REST API", webapp=True, init_app_fn=init_webapp_routes)

def main():
    app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    main()
