[![Docker Automated build](https://img.shields.io/docker/automated/clapclapexcitement/concourse-consul-kv-resource.svg?style=flat)](https://hub.docker.com/r/clapclapexcitement/concourse-consul-kv-resource/)

# concourse-consul-kv-resource

A [Concourse](http://concourse.ci/) resource for interacting with [Consul's KV store](https://www.consul.io/api/kv.html).

An experimental work in progress!

## Source configuration

* `key`: _Required_. The Consul key to interact with.
* `host`: _Required_. The Consul host.
* `token`: _Required_. A Consul ACL token.
* `tls_cert`: _Required_. A TLS cert for the Consul.
* `skip_cert_check`: _Optional_. Check the validity of the SSL cert.

## Behavior

### `out`: Set a Consul KV key's value

Sets the Consul KV key configured in the source to the value specified in the params.

#### Parameters

* `value`: _Required_. The value to set the key to.
