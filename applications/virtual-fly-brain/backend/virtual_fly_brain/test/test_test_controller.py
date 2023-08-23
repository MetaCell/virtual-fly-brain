# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from virtual_fly_brain.test import BaseTestCase


class TestTestController(BaseTestCase):
    """TestController integration test stubs"""

    def test_test_api(self):
        """Test case for test_api

        Test API
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/test',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
