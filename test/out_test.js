const assert = require('assert');
const outAction = require('../assets/lib/out');
const nock = require('nock');

function mockPut(value) {
  return nock('https://my-consul.com:8500')
    .put('/v1/kv/my/key?token=my-token', value)
    .reply(200, 'true');
}

describe('outAction', () => {
  let stdin;

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();
  });

  describe('when it is passed params with a `value`', () => {
    it('sets the Consul key to the value cited in the params.value and resolves the promise with the proper metadata', () => {
      mockPut('my-value');

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

      return outAction()
        .then(result => {
          assert.equal(result.metadata[0].name, 'value');
          assert.equal(result.metadata[0].value, 'my-value');
        });
    });
  });

  describe('when it is passed params with a `file`', () => {
    it('sets the Consul key to the value cited in the file and resolves the promise with the proper metadata', () => {
      mockPut('my-value-from-file');

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
            file: 'test/fixtures/value_from_file'
          }
        }));
      });

      return outAction('.')
        .then(result => {
          assert.equal(result.metadata[0].name, 'value');
          assert.equal(result.metadata[0].value, 'my-value-from-file');
        });
    });
  });
});
