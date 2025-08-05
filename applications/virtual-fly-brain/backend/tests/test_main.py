import unittest
import json
import pandas as pd
from virtual_fly_brain.__main__ import app

class TestMainModule(unittest.TestCase):
    def setUp(self):
        """Set up the test client."""
        self.app = app.test_client()
        self.app.testing = True

    def test_index_route(self):
        """Test the index route."""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        # self.assertIn(b'index.html', response.data)

    def test_get_instances(self):
        """Test the /get_instances route."""
        response = self.app.get('/get_instances?short_form=FBbt_00003748')
        self.assertEqual(response.status_code, 200)
        # # Parse the JSON response
        data = json.loads(response.data)
        self.assertIsInstance(data, list)

    def test_get_term_info(self):
        """Test the /get_term_info route."""
        response = self.app.get('/get_term_info?id=FBbt_00000001')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)

    def test_run_query(self):
        """Test the /run_query route."""
        response = self.app.get('/run_query?id=FBbt_00000001&query_type=example')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, dict)

    def test_not_found_error(self):
        """Test the 404 error handler."""
        response = self.app.get('/nonexistent_route')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertEqual(data['error'], 'Page not found')

    def test_internal_server_error(self):
        """Test the 500 error handler."""
        # Simulate an internal server error by triggering an exception
        response = self.app.get('/trigger_error')
        self.assertEqual(response.status_code, 404)
        data = json.loads(response.data)
        self.assertEqual(data['error'], 'Page not found')

if __name__ == '__main__':
    unittest.main()
