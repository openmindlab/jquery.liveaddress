#!/usr/bin/make -f

VERSION       := $(shell tagit -p --dry-run)
VERSION_FILE1 := package.json
VERSION_FILE2 := package-lock.json
VERSION_FILE3 := liveaddress.jquery.json
VERSION_FILE4 := src/liveAddressPlugin.js

clean: unversion

compile: node_modules

node_modules:
	npm install

publish: clean compile version upload unversion

upload:
	npm publish
	npm run build
	(cd resources && python publish.py "$(VERSION)")

version:
	sed -i.bak -e 's/^  "version": "0\.0\.0",/  "version": "$(VERSION)",/g' "$(VERSION_FILE1)" && rm -f "$(VERSION_FILE1).bak"
	sed -i.bak -e 's/^  "version": "0\.0\.0",/  "version": "$(VERSION)",/g' "$(VERSION_FILE2)" && rm -f "$(VERSION_FILE2).bak"
	sed -i.bak -e 's/^  "version": "0\.0\.0",/  "version": "$(VERSION)",/g' "$(VERSION_FILE3)" && rm -f "$(VERSION_FILE3).bak"
	sed -i.bak -e 's/^\tvar version \= "0.0.0";/\tvar version \= "$(VERSION)";/g' "$(VERSION_FILE4)" && rm -f "$(VERSION_FILE4).bak"

unversion:
	git checkout "$(VERSION_FILE1)" "$(VERSION_FILE2)" "$(VERSION_FILE3)" "$(VERSION_FILE4)"
	rm "$(VERSION_FILE1).bak" "$(VERSION_FILE2).bak" "$(VERSION_FILE3).bak" "$(VERSION_FILE4).bak" 

##########################################################

release: publish
	tagit -p && git push origin --tags

# node_modules is a real directory target
.PHONY: clean compile publish upload version unversion release
