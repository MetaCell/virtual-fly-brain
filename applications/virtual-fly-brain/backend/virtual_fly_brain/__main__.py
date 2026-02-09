import os
import json
import flask
import werkzeug
import numpy as np
import pandas as pd
import logging
import time
from datetime import datetime
from virtual_fly_brain.services.numpy_encoder import NumpyEncoder
vfb = None
try:
    import vfbquery as vfb
except ImportError as e:
    print("vfbquery module not found. Please install it using pip.")
from flask_cors import CORS, cross_origin
from virtual_fly_brain.services.queries import run_query
from virtual_fly_brain.services.term_info import get_term_info


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()  # This ensures logs go to stdout for pod logs
    ]
)

# Create logger for API requests
api_logger = logging.getLogger('vfb_api')


def log_request(func):
    """Decorator to log REST endpoint requests with input data"""
    def wrapper(*args, **kwargs):
        start_time = time.time()
        request_id = f"{datetime.now().isoformat()}_{int(time.time() * 1000000) % 1000000}"
        
        # Log request start
        request_data = {
            'request_id': request_id,
            'endpoint': flask.request.endpoint,
            'method': flask.request.method,
            'url': flask.request.url,
            'path': flask.request.path,
            'remote_addr': flask.request.remote_addr,
            'user_agent': flask.request.headers.get('User-Agent', ''),
            'args': dict(flask.request.args),
            'form_data': dict(flask.request.form) if flask.request.form else {},
            'json_data': flask.request.get_json(silent=True) if flask.request.is_json else None,
            'content_length': flask.request.content_length
        }
        
        api_logger.info(f"REQUEST_START: {json.dumps(request_data, cls=NumpyEncoder)}")
        
        try:
            # Execute the actual endpoint function
            result = func(*args, **kwargs)
            
            # Log successful response
            end_time = time.time()
            duration_ms = round((end_time - start_time) * 1000, 2)
            
            response_data = {
                'request_id': request_id,
                'status': 'SUCCESS',
                'duration_ms': duration_ms,
                'response_status': getattr(result, 'status_code', 200) if hasattr(result, 'status_code') else 200
            }
            
            api_logger.info(f"REQUEST_END: {json.dumps(response_data, cls=NumpyEncoder)}")
            return result
            
        except Exception as e:
            # Log error response
            end_time = time.time()
            duration_ms = round((end_time - start_time) * 1000, 2)
            
            error_data = {
                'request_id': request_id,
                'status': 'ERROR',
                'duration_ms': duration_ms,
                'error_type': type(e).__name__,
                'error_message': str(e)
            }
            
            api_logger.error(f"REQUEST_ERROR: {json.dumps(error_data, cls=NumpyEncoder)}")
            raise
    
    wrapper.__name__ = func.__name__
    return wrapper


def init_webapp_routes(app):
    @app.route('/', methods=['GET'])
    # @log_request
    def index():
        return flask.send_from_directory("www", 'index.html')


    @app.route('/get_instances', methods=['GET'])
    @cross_origin(supports_credentials=True)
    # @log_request
    def instances():
        short_form = flask.request.args.get('short_form')
        if not short_form:
            return flask.jsonify({'error': 'Missing required parameter: short_form'}), 400

        try:
            result = vfb.get_instances(short_form)
            if isinstance(result, pd.DataFrame):
                rows = result.to_dict(orient='records')
                headers = {col: {'title': col, 'order': i} for i, col in enumerate(result.columns)}
                response = {
                    'count': len(rows),
                    'headers': headers,
                    'rows': rows
                }
                return flask.jsonify(response)
            elif isinstance(result, pd.Series):
                result = result.to_dict()
            return flask.jsonify(result)
        except Exception as e:
            return flask.jsonify({'error': str(e)}), 500


    @app.route('/get_term_info', methods=['GET'])
    @cross_origin(supports_credentials=True)
    # @log_request
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
    # @log_request
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


def main():
    api_logger.info("Starting Virtual Fly Brain REST API server on host='0.0.0.0', port=8080")
    api_logger.info("Logging is configured for API request tracking")
    app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    main()
