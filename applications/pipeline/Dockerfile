# VFB precomputed pipeline: precomputed.zip per image folder (see README.md, vfb_pipeline.py).
# Built for the VFB cluster, whose VMs expose a qemu64 CPU without SSE4.2/POPCNT: no x86-64-v2 wheels
# (numpy < 2.4, scipy < 1.15) and nothing compiled with -march.
FROM python:3.12-slim-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends build-essential ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Pin the two packages whose newer wheels assume x86-64-v2 first, so the rest resolve against them.
RUN pip install --no-cache-dir "numpy<2.4" "scipy<1.15"

WORKDIR /app
COPY requirements.txt /app/requirements.txt
# igneous/zmesh/DracoPy (multires_draco) and navis are optional for the production path (legacy meshes;
# volume_man.obj or tube meshes from SWC) and are left out of the cluster image.
RUN grep -vE '^(igneous|zmesh|DracoPy|navis)' requirements.txt > /tmp/req.txt \
    && pip install --no-cache-dir -r /tmp/req.txt
COPY . /app
RUN python -c "import numpy, scipy, skimage, trimesh, nrrd, cloudvolume, vfb_pipeline; print('numpy', numpy.__version__)"
ENV PYTHONUNBUFFERED=1
USER 1000:1000
ENTRYPOINT ["python", "/app/vfb_pipeline.py"]
