#from cloudharness.utils.server import init_flask
import vfbquery as vfb
from cloudharness.utils.server import init_flask
import flask
from flask import request
from flask_cors import CORS, cross_origin
import os
import json

def init_webapp_routes(app):
    www_path = "/usr/src/app/www"

    @app.route('/get_instances', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def instances():
      return vfb.get_instances(request.args.get('short_form'))
      
    @app.route('/', methods=['GET'])
    def index():
        print(www_path)
        print("www path")
        return flask.send_from_directory(www_path, 'index.html')

    @app.route('/get_term_info', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def term_info():
      id = request.args.get('id')
      term_info_data = vfb.get_term_info(id)
      return term_info_data

app = init_flask(title="VFB index API", webapp=False, init_app_fn=init_webapp_routes)

def main():
  # CORS(app, support_credentials=True)
  app.static_url_path="/usr/src/app/www/static"
  app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    main()
