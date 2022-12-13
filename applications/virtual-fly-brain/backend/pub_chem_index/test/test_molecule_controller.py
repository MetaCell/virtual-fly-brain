# coding: utf-8

from __future__ import absolute_import
import unittest

from flask import json
from six import BytesIO

from virtual_fly_brain.models.molecule import Molecule  # noqa: E501
from virtual_fly_brain.test import BaseTestCase


class TestMoleculeController(BaseTestCase):
    """MoleculeController integration test stubs"""

    def test_create_molecule(self):
        """Test case for create_molecule

        Create a Molecule
        """
        molecule = {
  "synonyms" : [ "synonyms", "synonyms" ],
  "cid" : 0
}
        headers = { 
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/molecules',
            method='POST',
            headers=headers,
            data=json.dumps(molecule),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_delete_molecule(self):
        """Test case for delete_molecule

        Delete a Molecule
        """
        headers = { 
        }
        response = self.client.open(
            '/molecules/{molecule_id}'.format(molecule_id='molecule_id_example'),
            method='DELETE',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_molecule(self):
        """Test case for get_molecule

        Get a Molecule
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/molecules/{molecule_id}'.format(molecule_id='molecule_id_example'),
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_molecules(self):
        """Test case for get_molecules

        List All Molecules
        """
        headers = { 
            'Accept': 'application/json',
        }
        response = self.client.open(
            '/molecules',
            method='GET',
            headers=headers)
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_molecule(self):
        """Test case for update_molecule

        Update a Molecule
        """
        molecule = {
  "synonyms" : [ "synonyms", "synonyms" ],
  "cid" : 0
}
        headers = { 
            'Content-Type': 'application/json',
        }
        response = self.client.open(
            '/molecules/{molecule_id}'.format(molecule_id='molecule_id_example'),
            method='PUT',
            headers=headers,
            data=json.dumps(molecule),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    unittest.main()
