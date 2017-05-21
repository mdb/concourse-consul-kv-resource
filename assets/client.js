'use strict';

const Consul = require('consul-kv');

class Client {
  constructor(source) {
    return new Consul({
      host: source.host,
      token: source.token,
      tlsCert: source.tls_cert,
      tlsKey: source.tls_key,
      strictSSL: source.strict_ssl || true
    });
  }
}

module.exports = Client;
