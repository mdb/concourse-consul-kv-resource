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

describe('checkAction', () => {
  let stdin;

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();
  });

  it('gets the Consul key configured in the source and resolves its promise with the value', () => {
    mockGet();

    process.nextTick(() => {
      stdin.send(JSON.stringify({
        source: {
          host: 'my-consul.com',
          tls_cert: 'my-cert',
          tls_key: 'my-cert-key',
          token: 'my-token',
          key: 'my/key'
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
