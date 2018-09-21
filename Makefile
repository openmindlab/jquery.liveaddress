#!/usr/bin/make -f

VERSION := $(shell tagit -p --dry-run)

compile: node_modules

node_modules:
	npm install && git checkout package-lock.json

publish: compile
	(cd resources && python minify.py && python publish.py "$(VERSION)")

##########################################################

workspace:
	docker-compose run plugin /bin/sh

release:
	docker-compose run plugin make publish && tagit -p && git push origin --tags

# node_modules is a real directory target
.PHONY: compile publish workspace release
