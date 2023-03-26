ARG CLOUDHARNESS_FLASK

FROM $CLOUDHARNESS_FLASK

ENV MODULE_NAME=virtual_fly_brain
ENV WORKERS=2
ENV PORT=8080
ENV BUILDDIR=/dist

RUN apk update
RUN apk add gcc python3-dev musl-dev npm git

COPY ./client ${BUILDDIR}
WORKDIR ${BUILDDIR}
RUN npm install
RUN npm run build

WORKDIR /usr/src/app

COPY backend/requirements.txt /usr/src/app/
RUN pip3 install --no-cache-dir -r requirements.txt
RUN pip3 install --upgrade vfbquery
COPY backend/ /usr/src/app
RUN pip3 install -e .

# RUN cd virtual_fly_brain/libs && git clone https://github.com/VirtualFlyBrain/VFB_queries.git && cd VFB_queries && git checkout 84568f4 && pip3 install --no-cache-dir -r requirements.txt && cd ../../../

RUN cp -r ${BUILDDIR}/build /usr/src/app/virtual_fly_brain/www

WORKDIR /usr/src/app/virtual_fly_brain
RUN mkdir -p www/files
RUN mv www/static www/files

EXPOSE 8080
ENTRYPOINT gunicorn --log-level=info --preload --bind=0.0.0.0:8080 virtual_fly_brain.__main__:app
