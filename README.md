###Initialize and activate a new conda environment using python 3.9

```
conda create -n vfb python=3.9
conda activate vfb
```
###Installing submodule

From project's root folder:

```
git submodule init
git submodule update
cd applications/virtual-fly-brain/backend/virtual_fly_brain/libs/VFBquery
ls

```
Verify that setup.py exists in the current folder
```
pip install -e .
```

At this point you should be able to verify that the vfbquery dependency is installed
```
pip show vfbquery
```
with this output:
```
Name: vfbquery
Version: 0.0.1
Summary: Wrapper for querying VirtualFlyBrain knowledge graph.
Home-page: https://github.com/VirtualFlyBrain/VFBquery
Author: VirtualFlyBrain
```

###Installing backend and running

```
cd applications/virtual-fly-brain/backend
pip install -r requirements.txt
cd virtual_fly_brain
python __main__.py 
```

after that you will see Flask running with the following prompt:

```
 * Serving Flask app '__main__'
 * Debug mode: off WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8080
 * Running on http://172.20.10.2:8080
```


###Installing front end and running

```
cd applications/virtual-fly-brain/client
yarn
yarn build
yarn start
```
