'use strict';

const assert = require('assert');
const out = require('../assets/lib/out');
const nock = require('nock');

function mockPut(host) {
  return nock('https://my-consul.com:8500')
    .put('/v1/kv/my/key?token=my-token', 'my-value')
    .reply(200, 'true');
}

describe('out', () => {
  let stdin;

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();
  });

  it('sets the Consul key to the value passed in stdin and resolves the promise with the proper metadata', () => {
    mockPut();

    process.nextTick(() => {
      stdin.send(JSON.stringify({
        source: {
          host: 'my-consul.com',
          tls_cert: 'my-cert',
          tls_key: 'my-cert-key',
          token: 'my-token',
          key: 'my/key'
        },
        params: {
          value: 'my-value'
        }
      }));
    });

    return out()
      .then(result => {
        assert.equal(result.metadata[0].name, 'value');
        assert.equal(result.metadata[0].value, 'my-value');
      });
  });
});
