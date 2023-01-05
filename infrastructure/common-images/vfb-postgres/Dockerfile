FROM postgres:14
ENV DEBIAN_FRONTEND=noninteractive
ENV POSTGRES_PASSWORD postgres 
ENV POSTGRES_DB testdb 
COPY init.sql /docker-entrypoint-initdb.d/
COPY postgresql.conf /usr/share/postgresql/postgresql.conf.sample
