[![Docker Automated build](https://img.shields.io/docker/automated/clapclapexcitement/concourse-consul-kv-resource.svg?style=flat)](https://hub.docker.com/r/clapclapexcitement/concourse-consul-kv-resource/)
[![Build Status](https://travis-ci.org/mdb/concourse-consul-kv-resource.svg?branch=master)](https://travis-ci.org/mdb/concourse-consul-kv-resource)

# concourse-consul-kv-resource

A [Concourse](http://concourse.ci/) resource for interacting with [Consul's KV store](https://www.consul.io/api/kv.html).

`concourse-consul-kv-resource` can be used to get or set a key/value in Consul's KV store.

## Source configuration

* `host`: _Required_. The Consul host.
* `key`: _Required_. The Consul key to interact with. Note that all URL path parts following `/v1/kv` are required. For example, if your key is `my-consul:8500/v1/kv/my/key`, then `key` should be "my/key".
* `token`: _Optional_. A Consul ACL token.
* `tls_cert`: _Optional_. A TLS cert for the Consul.
* `tls_key`: _Optional_. A TLS cert key for the Consul.
* `ca`: _Optional_. A CA cert for the Consul.
* `port`: _Optional_. The port on which the Consul API is hosted. Defaults to `8500`.
* `protocol`: _Optional_. The protocol to use in calling the Consul API. Defaults to `https`.
* `skip_cert_check`: _Optional_. Check the validity of the SSL cert.

## Behavior

### `in`: Get a Consul KV key's value

Gets the value of the Consul KV key configured in the source. The key's plain text value is written to a `<resource-get>/<key-name>` file.

For example, the following pipeline's `get-my-consul-key` job writes the `foo` key's value to a `my-consul-key/my/key` file:

```yaml
...

resources:

- name: my-consul-key
  type: consul-kv
  source:
    token: my-acl-token
    host: my-consul.com
    tls_cert: my-cert-string
    tls_key: my-cert-key-string
    key: my/key

jobs:

- name: get-my-consul-key
  plan:
  - get: my-consul-key
```

### `out`: Set a Consul KV key's value

Sets the Consul KV key configured in the source to the value specified in the params.

#### Parameters

`value` _or_ `file` must be set. Both cannot be set.

* `value`: _Optional_. The value to set the key to.
* `file`: _Optional_. The path to a file in which the intended value is written.

## Example pipeline

```yaml
resources:

- name: my-consul-key
  type: consul-kv
  source:
    token: my-acl-token
    host: my-consul.com
    tls_cert: my-cert-string
    tls_key: my-cert-key-string
    key: my/key

resource_types:

- name: consul-kv
  type: docker-image
  source:
    repository: clapclapexcitement/concourse-consul-kv-resource
    tag: latest

jobs:

- name: get-my-consul-key
  plan:
  - get: my-consul-key

- name: set-my-consul-key
  plan:
  - put: my-consul-key
    params:
      value: 'foobar'

- name: set-my-consul-key-from-a-file
  plan:
  - put: my-consul-key
    params:
      file: my-new-key/my-key-file
```

## Development & testing

`concourse-consul-kv-resource` development assumes relative familiarity with [Node.js](https://nodejs.org) and [Docker](https://www.docker.com/).

To build and test `concourse-consul-kv-resource`:

```
make
```

This...

1. builds a `concourse-consul-kv-resource` Docker image by...
    1. installing the Node.js JavaScript dependencies
    2. linting the Node.js JavaScript source code
    3. running the Node.js JavaScript-based unit tests
    4. installing the `concourse-consul-kv-resource` Node.js JavaScript source code in the resulting Docker image
2. runs a suite of acceptance tests against the resulting `concourse-consul-kv-resource` Docker image that...
    1. use `docker-compose` to start a local Consul seeded with a `my/key` key
    2. run the `concourse-consul-kv-resource` Docker image with various standard input stream JSON structures and arguments that exercise the image's `check`, `in`, and `out` functionality using the local Consul

### Functional testing

`concourse-consul-kv-resource`'s `docker-compose.yml` can also be used to start a local Concourse, Consul, and Docker registry for test driving a local `concourse-consul-kv-resource` Docker image build.

1. run `docker-compose up` to start a `localhost:8080` Concourse, a `localhost:5000` Docker registry, and a `localhost:8500` Consul.
2. build a local `localhost:5000/concourse-consul-kv-resource:latest` `concourse-consul-kv-resource` image and publish it to the `localhost:5000` Docker registry:
    ```bash
    docker build --tag \
      localhost:5000/concourse-consul-kv-resource:latest .
    ```
    ```bash
    docker login \
      --username test \
      --password test \
      http://localhost:5000 \
    ```
    ```bash
    docker push \
      localhost:5000/concourse-consul-kv-resource:latest
    ```
3. visit the `http://localhost:8080` Concourse and download the appropriate `fly` for your platform from the Concourse homepage.
4. log into the `localhost:8080` Concourse via `fly` using the username/password combo `test/test`:
    ```bash
    fly \
      --target "local" login \
      --username test \
      --password test \
      --concourse-url http://localhost:8080
    ```
5. use the `pipeline.yml` in this repo to set and unpause a `test` pipeline:
    ```bash
    fly \
      --target local set-pipeline \
      --pipeline test \
      --config pipeline.yml \
      --non-interactive
    ```
    ```bash
    fly \
      --target local unpause-pipeline \
      --pipeline test
    ```
6. log into the `localhost:8080` Concourse in your web browser using username/password `test`/`test` and interact with the `test` pipeline. If you'd like to seed Consul with an initial `my/key` value:
    ```bash
    curl \
      --request PUT \
      --data my-value \
      http://localhost:8500/v1/kv/my-key
    ```
