# coding: utf-8

import sys
from setuptools import setup, find_packages

NAME = "virtual_fly_brain"
VERSION = "1.0.0"

# To install the library, run the following
#
# python setup.py install
#
# prerequisite: setuptools
# http://pypi.python.org/pypi/setuptools

REQUIRES = [
    "connexion>=2.0.2",
    "swagger-ui-bundle>=0.0.2",
    "python_dateutil>=2.6.0",
    "psycopg2-binary"
]

setup(
    name=NAME,
    version=VERSION,
    description="virtual_fly_brain",
    author_email="cloudharness@metacell.us",
    url="",
    keywords=["OpenAPI", "virtual_fly_brain"],
    install_requires=REQUIRES,
    packages=find_packages(),
    package_data={'': ['openapi/openapi.yaml']},
    include_package_data=True,
    entry_points={
        'console_scripts': ['virtual_fly_brain=virtual_fly_brain.__main__:main']},
    long_description="""\
    virtual_fly_brain
    """
)

