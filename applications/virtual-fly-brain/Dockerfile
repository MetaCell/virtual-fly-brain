ARG CLOUDHARNESS_FLASK

FROM ${CLOUDHARNESS_FLASK}

ARG DOMAIN
ARG BE_DOMAIN

ENV MODULE_NAME=virtual_fly_brain
ENV WORKERS=2
ENV PORT=8080
ENV BUILDDIR=/app

# Update ImageMagick to fix critical security vulnerabilities
# CVE-2025-57807, CVE-2025-55298, CVE-2025-55154, CVE-2025-55212, CVE-2025-57803
RUN apt-get update && apt-get upgrade -y imagemagick

RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    libgl1 \
    libglx-mesa0 \
    libgl1-mesa-dev \
    xvfb \
    libglu1-mesa \
    libosmesa6 \
    freeglut3-dev \
    git \
    cron \
    x11-utils \
    mesa-utils \
    libx11-dev \
    libxext-dev \
    && rm -rf /var/lib/apt/lists/*

RUN apt-get remove -y nodejs npm || true

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    node --version

RUN npm install -g yarn && \
    yarn --version

# Set up virtual display for OpenGL
ENV DISPLAY=:99
ENV LIBGL_ALWAYS_INDIRECT=1
ENV MESA_GL_VERSION_OVERRIDE=3.3

COPY frontend ${BUILDDIR}
WORKDIR ${BUILDDIR}
ENV VFB_DOMAIN=https://${BE_DOMAIN}
RUN yarn install
RUN yarn run build

WORKDIR /usr/src/app
COPY backend/requirements.txt /usr/src/app/
RUN pip3 install --no-cache-dir -r requirements.txt
RUN echo 'test s'
COPY backend/ /usr/src/app
RUN pip3 install -e .

RUN cp -r ${BUILDDIR}/dist/ /usr/src/app/virtual_fly_brain/www

# Set up cache cleanup cron job
COPY backend/vfb_cache_cleanup.sh /usr/local/bin/vfb_cache_cleanup.sh
RUN chmod +x /usr/local/bin/vfb_cache_cleanup.sh

# Copy and set up entrypoint script
COPY backend/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Create cron job to run cache cleanup daily at 2 AM
RUN echo "0 2 * * * /usr/local/bin/vfb_cache_cleanup.sh" | crontab -

# Create log directory for cache cleanup logs
RUN mkdir -p /var/log && touch /var/log/vfb_cache_cleanup.log
WORKDIR /usr/src/app/virtual_fly_brain

EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh", "gunicorn", "--log-level=info", "--preload", "--bind=0.0.0.0:8080", "--timeout=240", "--graceful-timeout=30", "--keep-alive=5", "virtual_fly_brain.__main__:app"]
