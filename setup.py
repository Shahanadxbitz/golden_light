from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in client_golden_light/__init__.py
from client_golden_light import __version__ as version

setup(
	name="client_golden_light",
	version=version,
	description="Golden Light",
	author="Peniel Technology LLC",
	author_email="developer@penieltech.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
