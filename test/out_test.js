const assert = require('assert');
const outAction = require('../assets/lib/out');
const nock = require('nock');

function mockPut(value) {
  return nock('https://my-consul.com:8500')
    .put('/v1/kv/my/key?token=my-token', value)
    .reply(200, 'true');
}

function sourceJson(params) {
  return JSON.stringify({
    source: {
      host: 'my-consul.com',
      tls_cert: 'my-cert',
      tls_key: 'my-cert-key',
      token: 'my-token',
      key: 'my/key'
    },
    params: params
  });
}

describe('outAction', () => {
  let stdin;

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();
  });

  describe('when it is passed params with a `value`', () => {
    let result;

    beforeEach(() => {
      mockPut('my-value');

      process.nextTick(() => {
        stdin.send(sourceJson({
          value: 'my-value'
        }));
      });

      return outAction()
        .then(res => {
          result = res;
        });
    });

    it('sets the Consul key to the value cited in the params.value and resolves the promise with the proper version', () => {
      assert.equal(result.version.value, 'my-value');
    });

    it('sets the Consul key to the value cited in the params.value and resolves the promise with metadata that includes a "timestamp"', () => {
      assert.equal(result.metadata[0].name, 'timestamp');
    });

    it('sets the Consul key to the value cited in the params.value and resolves the promise with metadata that includes a "value"', () => {
      assert.equal(result.metadata[1].name, 'value');
      assert.equal(result.metadata[1].value, 'my-value');
    });
  });

  describe('when it is passed params with a `file`', () => {
    let result;

    beforeEach(() => {
      mockPut('my-value-from-file');

      process.nextTick(() => {
        stdin.send(sourceJson({
          file: 'test/fixtures/value_from_file'
        }));
      });

      return outAction('.')
        .then(res => {
          result = res;
        });
    });

    it('sets the Consul key to the value cited in the file and resolves the promise with the proper version', () => {
      assert.equal(result.version.value, 'my-value-from-file');
    });

    it('sets the Consul key to the value cited in the params.value and resolves the promise with metadata that includes a "timestamp"', () => {
      assert.equal(result.metadata[0].name, 'timestamp');
    });

    it('sets the Consul key to the value cited in the params.value and resolves the promise with metadata that includes a "value"', () => {
      assert.equal(result.metadata[1].name, 'value');
      assert.equal(result.metadata[1].value, 'my-value-from-file');
    });
  });
});
