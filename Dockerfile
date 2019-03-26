FROM node:11.12

WORKDIR /opt/resource

COPY assets assets
COPY test test
COPY package.json .
COPY package-lock.json .
COPY .eslintrc.json .

RUN apt-get update && \
  ls && \
  npm install && \
  npm test

COPY assets/check.js check
COPY assets/in.js in
COPY assets/out.js out
COPY assets/lib lib

RUN chmod a+x check in out
