all: build acc-test

build:
	docker build -t concourse-consul-kv-resource .

acc-test: build install-bats
	.bats/bin/bats test/acceptance

clone-bats:
	if ! [ -d .bats-core ]; then \
		git clone --depth 1 https://github.com/bats-core/bats-core.git .bats-core; \
	fi

install-bats: clone-bats
	if ! [ -d .bats ]; then \
		mkdir .bats; \
		cd .bats-core; \
		./install.sh ../.bats; \
	fi
