#from cloudharness.utils.server import init_flask
from vfbquery import get_term_info, get_instances
import flask
from flask import request
from flask_cors import CORS, cross_origin
import os
import json

def init_webapp_routes(app):
    www_path = os.path.dirname(os.path.abspath(__file__)) + "/www"

    @app.route('/get_term_info', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def term_info():
      id = request.args.get('id')
      term_info_data = get_term_info(id)
      return term_info_data

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

def main():
  app = app = flask.Flask(__name__)
  CORS(app, support_credentials=True)
  init_webapp_routes(app)
  app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    main()