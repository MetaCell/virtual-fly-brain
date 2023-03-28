import vfbquery as vfb
from cloudharness.utils.server import init_flask
import flask
from flask import request

def test_api():  # noqa: E501
    return "Test Endpoint"

def get_term_info(id):
    stack_viewer_data = vfb.get_term_info(id)
    return stack_viewer_data