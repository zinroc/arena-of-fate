.PHONY: all lint lint-php lint-ci-models lint-ci-controllers lint-ci-views depend lint-js

all: depend lint

depend:
	npm install

lint-php: lint-ci-models lint-ci-controllers lint-ci-views

application/controllers:
	echo here
	echo *.php
	php -l *.php

lint-ci-models:
	@set -e; \
	for f in application/models/*.php; do \
		php -l $$f; \
	done

lint-ci-controllers:
	@set -e; \
	for f in application/controllers/*.php; do \
		php -l $$f; \
	done

lint-ci-views:
	@set -e; \
	for f in application/views/*.php; do \
		php -l $$f; \
	done

lint: lint-php lint-js

lint-js:
	jshint assets/js/controllers.js
	jshint assets/js/services.js
	jshint assets/js/utils.js
	jshint assets/js/controllers/*.js

