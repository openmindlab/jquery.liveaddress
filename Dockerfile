FROM node:alpine

COPY . /code
WORKDIR /code

RUN apk add -U make git nodejs nodejs-npm py-boto py-yuicompressor \
	&& wget -O - "https://github.com/smartystreets/version-tools/releases/download/0.0.6/release.tar.gz" | tar -xz -C /usr/local/bin/
