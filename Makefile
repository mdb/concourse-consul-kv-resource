all: build acc-test

build:
	docker build -t concourse-consul-kv-resource .

acc-test: build install-bats
	.bats/bin/bats test/acceptance

install-bats:
	if ! [ -x .bats/bin/bats ]; then \
		git clone --depth 1 https://github.com/sstephenson/bats.git .bats; \
	fi
