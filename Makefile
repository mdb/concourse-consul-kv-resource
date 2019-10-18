all: build acc-test

build:
	docker build -t concourse-consul-kv-resource .

acc-test: build
	bats test/acceptance
