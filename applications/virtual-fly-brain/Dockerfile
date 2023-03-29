ARG CLOUDHARNESS_FLASK
ARG VFB_UI

FROM $CLOUDHARNESS_FLASK
FROM $VFB_UI as base

ENV MODULE_NAME=virtual_fly_brain
ENV WORKERS=2
ENV PORT=8080
ENV BUILDDIR=/dist

RUN apk update
RUN apk add gcc python3-dev musl-dev yarn git

COPY ./client ${BUILDDIR}
WORKDIR ${BUILDDIR}
RUN yarn install
RUN yarn build

WORKDIR /usr/src/app

COPY backend/requirements.txt /usr/src/app/
RUN pip3 install --no-cache-dir -r requirements.txt
COPY backend/ /usr/src/app
RUN pip3 install -e .

RUN rm -rf ${BACKEND_DIR}/www
COPY --from=base ${BUILDDIR}/dist/ /usr/src/app/www
COPY --from=base ${BUILDDIR}/build ${BACKEND_DIR}/www
WORKDIR /usr/src/app/virtual_fly_brain

EXPOSE 8080
ENTRYPOINT gunicorn --log-level=info --preload --bind=0.0.0.0:8080 virtual_fly_brain.__main__:app
