[![Docker Automated build](https://img.shields.io/docker/automated/clapclapexcitement/concourse-consul-kv-resource.svg?style=flat)](https://hub.docker.com/r/clapclapexcitement/concourse-consul-kv-resource/)

# concourse-consul-kv-resource

A [Concourse](http://concourse.ci/) resource for interacting with [Consul's KV store](https://www.consul.io/api/kv.html).

`concourse-consul-kv-resource` can be used to get or set a key in Consul's KV store.

## Source configuration

* `key`: _Required_. The Consul key to interact with.
* `host`: _Required_. The Consul host.
* `token`: _Required_. A Consul ACL token.
* `tls_cert`: _Required_. A TLS cert for the Consul.
* `tls_key`: _Required_. A TLS cert key for the Consul.
* `port`: _Optional_. The port on which the Consul API is hosted. Defaults to `8500`.
* `protocol`: _Optional_. The protocol to use in calling the Consul API. Defaults to `https`.
* `skip_cert_check`: _Optional_. Check the validity of the SSL cert.

## Behavior

### `in`: Get a Consul KV key's value

Gets the value of the Consul KV key configured in the source.

### `out`: Set a Consul KV key's value

Sets the Consul KV key configured in the source to the value specified in the params.

#### Parameters

* `value`: _Required_. The value to set the key to.

## Example pipeline

```
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

- name: set-my-consul-key
  plan:
  - put: resource-deploy-web-app
    params:
      value: 'foobar'
```
