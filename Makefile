#!/usr/bin/make -f

VERSION       := $(shell tagit -p --dry-run)
VERSION_FILE1 := package.json
VERSION_FILE2 := package-lock.json
VERSION_FILE3 := liveaddress.jquery.json

clean: unversion
	rm -rf node_modules workspace

compile: node_modules

node_modules:
	npm install

publish: clean compile version upload unversion

upload:
	npm publish
	(cd resources && python minify.py && python publish.py "$(VERSION)")

version:
	sed -i -E 's/^ "version": "0\.0\.0",/ "version": "$(VERSION)",/g' "$(VERSION_FILE1)"
	sed -i -E 's/^ "version": "0\.0\.0",/ "version": "$(VERSION)",/g' "$(VERSION_FILE2)"
	sed -i -E 's/^ "version": "0\.0\.0",/ "version": "$(VERSION)",/g' "$(VERSION_FILE3)"

unversion:
	git checkout "$(VERSION_FILE1)" "$(VERSION_FILE2)" "$(VERSION_FILE3)"

##########################################################

workspace:
	docker-compose run plugin /bin/sh

release:
	docker-compose run plugin make publish && tagit -p && git push origin --tags

# node_modules is a real directory target
.PHONY: clean compile publish upload version unversion workspace release
