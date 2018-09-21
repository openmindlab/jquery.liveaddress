#!/usr/bin/make -f

VERSION           := $(shell tagit -p --dry-run)
VERSION_FILE1     := package.json
VERSION_FILE2     := package-lock.json

compile: node_modules

node_modules:
	npm install

publish: compile
	(cd resources && python minify.py && python publish.py "$(VERSION)")

##########################################################

workspace:
	docker-compose run plugin /bin/sh

release:
	docker-compose run plugin make publish && tagit -p && git push origin --tags

# node_modules is a real directory target
.PHONY: compile publish workspace release
