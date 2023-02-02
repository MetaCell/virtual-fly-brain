#from cloudharness.utils.server import init_flask
from libs.VFB_queries.src.vfb_queries import get_term_info
import flask
from flask import request
from flask_cors import CORS, cross_origin
import os

def init_webapp_routes(app):
    www_path = os.path.dirname(os.path.abspath(__file__)) + "/www"

    @app.route('/get_term_info', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def term_info():
      return get_term_info(request.args.get('id'))
      
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
