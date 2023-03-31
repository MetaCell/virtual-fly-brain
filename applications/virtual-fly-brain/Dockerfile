ARG CLOUDHARNESS_FLASK

FROM $CLOUDHARNESS_FLASK

ENV MODULE_NAME=virtual_fly_brain
ENV WORKERS=2
ENV PORT=8080
ENV BUILDDIR=/app

RUN apk update
RUN apk add gcc python3-dev musl-dev yarn git

COPY client ${BUILDDIR}
RUN pwd && ls -ls
WORKDIR ${BUILDDIR}
RUN yarn install
RUN yarn run build
RUN pwd && ls
WORKDIR /usr/src/app

COPY backend/requirements.txt /usr/src/app/
RUN pip3 install --no-cache-dir -r requirements.txt
COPY backend/ /usr/src/app
RUN pip3 install -e .

#RUN rm -rf ${BACKEND_DIR}/www
RUN cp -r ${BUILDDIR}/build/ /usr/src/app/www
RUN cp -r ${BUILDDIR}/build/ /app/www
WORKDIR /usr/src/app/virtual_fly_brain

EXPOSE 8080
ENTRYPOINT gunicorn --log-level=info --preload --bind=0.0.0.0:8080 virtual_fly_brain.__main__:app
