ARG CLOUDHARNESS_FLASK

FROM ${CLOUDHARNESS_FLASK}

ARG DOMAIN
ARG BE_DOMAIN
ARG BUILD_BACKEND
ARG NEUROGLASS_DATA_PROTOCOL
ARG NEUROGLASS_DATA_BASE_URL
ARG NEUROGLASS_URL

ENV MODULE_NAME=virtual_fly_brain
ENV WORKERS=2
ENV PORT=8080
ENV BUILDDIR=/app
ENV BUILD_BACKEND=$BUILD_BACKEND

# Update ImageMagick to fix critical security vulnerabilities
# CVE-2025-57807, CVE-2025-55298, CVE-2025-55154, CVE-2025-55212, CVE-2025-57803
RUN apt-get update && apt-get upgrade -y imagemagick

# Remove bluez if present (CVE-2023-44431 - no fix available, not needed for this app)
RUN apt-get remove -y bluez bluez-obexd libbluetooth3 || true

# Remove golang if present (not needed for this Python/Node.js application)
# CVE-2026-27143 / GO-2026-4868 - arithmetic overflow in loop induction variables (CVSS 9.8 CRITICAL)
# CVE-2025-68121 - improper TLS session resumption via mutated ClientCAs/RootCAs (CVSS 10.0 CRITICAL)
# CVE-2026-27144 / GO-2026-4867 - memory corruption via no-op interface conversion in compiler (CVSS critical)
RUN apt-get purge -y golang golang-go golang-1.* 2>/dev/null || true && \
    apt-get autoremove -y 2>/dev/null || true && \
    rm -rf /usr/local/go /usr/local/bin/go /usr/local/bin/gofmt && \
    find /usr/bin /usr/local/bin -name 'go' -o -name 'gofmt' -o -name 'gopls' 2>/dev/null | xargs rm -f

RUN apt-get update && apt-get install -y \
    curl \
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

RUN npm install -g yarn serve && \
    yarn --version

# Upgrade node-tar to fix node-tar vulnerabilities from the base image:
# CVE-2026-24842 - path traversal via hardlink bypass (CVSS 8.2 HIGH, fixed in 7.5.7)
# CVE-2026-23950 - symlink poisoning via Unicode path collision race condition (CVSS 8.8 HIGH, fixed in 7.5.4)
RUN npm install -g tar@^7.5.7 2>/dev/null || true

# Upgrade cross-spawn to fix CVE-2024-21538 (ReDoS via improper input sanitization, CVSS 7.5 HIGH, fixed in 7.0.5)
RUN npm install -g cross-spawn@^7.0.5 2>/dev/null || true

# Set up virtual display for OpenGL
ENV DISPLAY=:99
ENV LIBGL_ALWAYS_INDIRECT=1
ENV MESA_GL_VERSION_OVERRIDE=3.3

COPY frontend ${BUILDDIR}
WORKDIR ${BUILDDIR}
RUN yarn install
# Debug: Print all environment variables and the VFB_DOMAIN value
RUN echo "=== Environment Check ===" && \
    echo "BE_DOMAIN ARG: ${BE_DOMAIN}" && \
    echo "Full VFB_DOMAIN value: https://${BE_DOMAIN}" && \
    export VFB_DOMAIN="https://${BE_DOMAIN}" && \
    echo "Exported VFB_DOMAIN: $VFB_DOMAIN" && \
    echo "========================"
# Pass VFB_DOMAIN and Neuroglass datasource config to Vite build process explicitly
RUN export VFB_DOMAIN="https://${BE_DOMAIN}" && \
    export NEUROGLASS_DATA_PROTOCOL="${NEUROGLASS_DATA_PROTOCOL}" && \
    export NEUROGLASS_DATA_BASE_URL="${NEUROGLASS_DATA_BASE_URL}" && \
    export NEUROGLASS_URL="${NEUROGLASS_URL}" && \
    yarn run build

WORKDIR /usr/src/app
COPY backend/requirements.txt /usr/src/app/
# === CONDITIONAL BACKEND BUILD: only if BUILD_BACKEND != "false" ===
RUN if [ "$BUILD_BACKEND" != "false" ]; then \
      pip3 install --no-cache-dir -r requirements.txt; \
    else \
      echo "Skipping backend requirements install."; \
    fi

COPY backend/ /usr/src/app
RUN if [ "$BUILD_BACKEND" != "false" ]; then \
      pip3 install -e .; \
    else \
      echo "Skipping backend build."; \
    fi

RUN cp -r ${BUILDDIR}/dist/ /usr/src/app/virtual_fly_brain/www

# Set up cache cleanup cron job
COPY backend/vfb_cache_cleanup.sh /usr/local/bin/vfb_cache_cleanup.sh
RUN chmod +x /usr/local/bin/vfb_cache_cleanup.sh

# Copy and set up entrypoint script
COPY backend/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Only set up cache cleanup cron if BUILD_BACKEND != "false"
RUN if [ "$BUILD_BACKEND" != "false" ]; then \
      echo "0 2 * * * /usr/local/bin/vfb_cache_cleanup.sh" | crontab - && \
      mkdir -p /var/log && touch /var/log/vfb_cache_cleanup.log ; \
    else \
      echo "Skipping cronjob setup for frontend-only builds"; \
    fi
    
WORKDIR /usr/src/app/virtual_fly_brain

EXPOSE 8080
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]