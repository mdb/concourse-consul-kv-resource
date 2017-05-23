FROM node:7

WORKDIR /opt/resource

COPY assets/check.js check
COPY assets/in.js in
COPY assets/out.js out

COPY assets/client.js client.js
COPY assets/handlers.js handlers.js
COPY package.json package.json

RUN apt-get update & \
  npm install --quiet

RUN chmod a+x check in out
