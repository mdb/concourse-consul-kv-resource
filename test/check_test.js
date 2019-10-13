const assert = require('assert');
const nock = require('nock');
const checkAction = require('../assets/lib/check');

function mockGet() {
  return nock('https://my-consul.com:8500')
    .get('/v1/kv/my/key?token=my-token')
    .reply(200, [{
      Value: 'bXktdmFsdWU='
    }]);
}

function sourceJson(extra) {
  extra = extra || {};

  return JSON.stringify(Object.assign({
    source: {
      host: 'my-consul.com',
      tls_cert: 'my-cert',
      tls_key: 'my-cert-key',
      token: 'my-token',
      key: 'my/key'
    }
  }, extra));
}

describe('checkAction', () => {
  let stdin;

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();
  });

  describe('when there is no existing version', () => {
    it('gets the Consul key configured in the source and resolves its promise with the value', () => {
      mockGet();

      process.nextTick(() => {
        stdin.send(sourceJson());
      });

      return checkAction()
        .then(result => {
          assert.equal(result.length, 1);
          assert.deepEqual(result[0], { value: 'my-value' });
        }, rejected => {
          console.log('rejected: ', rejected);
        });
    });
  });

  describe('when there is an existing version but it has the same value as the current Consul key', () => {
    it('resolves its promise with an empty array', () => {
      mockGet();

      process.nextTick(() => {
        stdin.send(sourceJson({
          version: {
            value: 'my-value'
          }
        }));
      });

      return checkAction()
        .then(result => {
          assert.equal(result.length, 0);
        }, rejected => {
          console.log('rejected: ', rejected);
        });
    });
  });

  describe('when there is an existing version and it is different from the current Consul key value', () => {
    it('gets the Consul key configured in the source and resolves its promise with the new value', () => {
      mockGet();

      process.nextTick(() => {
        stdin.send(sourceJson({
          version: {
            value: 'my-original-value'
          }
        }));
      });

      return checkAction()
        .then(result => {
          assert.equal(result.length, 1);
          assert.deepEqual(result[0], { value: 'my-value' });
        }, rejected => {
          console.log('rejected: ', rejected);
        });
    });
  });
});
