.DEFAULT_GOAL := help

.PHONY: help install test test-e2e coverage audit html pdf

help: ## Show available commands
	@awk 'BEGIN {FS = ":.*##"; print "Usage: make <command> [INPUT=file] [OUTPUT=file]"; print ""; print "Commands:"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install npm dependencies
	npm install

test: ## Run tests with 100% coverage checks
	npm test

test-e2e: ## Run Puppeteer end-to-end tests
	npm run test:e2e

coverage: ## Run tests and enforce 100% coverage
	npm run test:coverage

audit: ## Check npm dependencies for vulnerabilities
	npm audit

html: ## Convert Markdown to HTML; requires INPUT and OUTPUT
	@test -n "$(INPUT)" || (printf '%s\n' 'INPUT is required, for example: make html INPUT=example_doc.md OUTPUT=example_doc.html' >&2; exit 1)
	@test -n "$(OUTPUT)" || (printf '%s\n' 'OUTPUT is required, for example: make html INPUT=example_doc.md OUTPUT=example_doc.html' >&2; exit 1)
	grip - --export "$(OUTPUT)" < "$(INPUT)"

pdf: ## Convert HTML to PDF; requires INPUT
	@test -n "$(INPUT)" || (printf '%s\n' 'INPUT is required, for example: make pdf INPUT=example_doc.html' >&2; exit 1)
	node renderToPdf.js "$(INPUT)"
