const Consul = require('consul-kv');

class Client {
  constructor(source) {
    return new Consul({
      port: source.port || '8500',
      protocol: source.protocol || 'https',
      host: source.host,
      token: source.token,
      tlsCert: source.tls_cert,
      tlsKey: source.tls_key,
      ca: source.ca,
      strictSSL: source.skip_ssl_check ? false : true
    });
  }
}

module.exports = Client;
