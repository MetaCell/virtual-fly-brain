#from cloudharness.utils.server import init_flask
import vfbquery as vfb
from cloudharness.utils.server import init_flask
import flask
from flask import request
from flask_cors import CORS, cross_origin
import os
import json

def init_webapp_routes(app):
    @app.route('/get_instances', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def instances():
      return vfb.get_instances(request.args.get('short_form'))
      
    @app.route('/get_term_info', methods=['GET'])
    @cross_origin(supports_credentials=True)
    def term_info():
      id = request.args.get('id')
      term_info_data = vfb.get_term_info(id)
      return term_info_data
      
    @app.route('/static/js/<path:path>', methods=['GET'])
    def send_static_js(path):
        www_path = os.path.dirname(os.path.abspath(__file__)) + "/www"
        print(www_path)
        wwwp = os.path.join(www_path, 'static')
        print("www path")
        print(wwwp)
        print(path)
        return flask.send_from_directory(wwwp, path)

    @app.route('/static/css/<path:path>', methods=['GET']) 
    def send_static_css(path):
        www_path = os.path.dirname(os.path.abspath(__file__)) + "/www"
        print(www_path)
        wwwp = os.path.join(www_path, 'static')
        print("www path")
        print(wwwp)
        print(path)
        return flask.send_from_directory(wwwp, path)

app = init_flask(title="VFB index API", webapp=True, init_app_fn=init_webapp_routes)

def main():
  CORS(app, support_credentials=True)
  app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    main()
