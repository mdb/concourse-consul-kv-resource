[![Docker Automated build](https://img.shields.io/docker/automated/clapclapexcitement/concourse-consul-kv-resource.svg?style=flat)](https://hub.docker.com/r/clapclapexcitement/concourse-consul-kv-resource/)
[![Build Status](https://travis-ci.org/mdb/concourse-consul-kv-resource.svg?branch=master)](https://travis-ci.org/mdb/concourse-consul-kv-resource)

# concourse-consul-kv-resource

A [Concourse](http://concourse.ci/) resource for interacting with [Consul's KV store](https://www.consul.io/api/kv.html).

`concourse-consul-kv-resource` can be used to get or set a key/value in Consul's KV store.

## Source configuration

* `key`: _Required_. The Consul key to interact with. Note that all URL path parts following `/v1/kv` are required. For example, if your key is `my-consul:8500/v1/kv/my/key`, then `key` should be "my/key".
* `host`: _Required_. The Consul host.
* `token`: _Optional_. A Consul ACL token.
* `tls_cert`: _Optional_. A TLS cert for the Consul.
* `tls_key`: _Required_. A TLS cert key for the Consul.
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
