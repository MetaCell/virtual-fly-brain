# ARG CLOUDHARNESS_FLASK

FROM flask_debian:v1

ARG DOMAIN

ENV MODULE_NAME=virtual_fly_brain
ENV WORKERS=2
ENV PORT=8080
ENV BUILDDIR=/app

RUN echo "Building ${MODULE_NAME} for domain ${DOMAIN}"

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
    && rm -rf /var/lib/apt/lists/*

RUN apt-get remove -y nodejs npm || true

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    node --version

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && \
    apt-get install -y yarn && \
    yarn --version

# Set up virtual display for OpenGL
ENV DISPLAY=:99

COPY frontend ${BUILDDIR}
WORKDIR ${BUILDDIR}
ENV VFB_DOMAIN=https://${DOMAIN}
RUN yarn install
RUN yarn run build

WORKDIR /usr/src/app
COPY backend/requirements.txt /usr/src/app/
RUN pip3 install --no-cache-dir -r requirements.txt
RUN echo 'test s'
COPY backend/ /usr/src/app
RUN pip3 install -e .

RUN cp -r ${BUILDDIR}/dist/ /usr/src/app/virtual_fly_brain/www
WORKDIR /usr/src/app/virtual_fly_brain

EXPOSE 8080
ENTRYPOINT ["gunicorn", "--log-level=info", "--preload", "--bind=0.0.0.0:8080", "virtual_fly_brain.__main__:app"]
