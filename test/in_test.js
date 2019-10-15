const assert = require('assert');
const inAction = require('../assets/lib/in');
const nock = require('nock');
const fs = require('fs-extra');

function mockGet() {
  return nock('https://my-consul.com:8500')
    .get('/v1/kv/my/key?token=my-token')
    .reply(200, [{
      Value: 'bXktdmFsdWU='
    }]);
}

function sourceJson() {
  return JSON.stringify({
    source: {
      host: 'my-consul.com',
      tls_cert: 'my-cert',
      tls_key: 'my-cert-key',
      token: 'my-token',
      key: 'my/key'
    }
  });
}

describe('inAction', () => {
  let stdin;

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();

    mockGet();

    process.nextTick(() => {
      stdin.send(sourceJson());
    });
  });

  it('gets the Consul key configured in the source and resolves the promise with the proper metadata', () => {
    return inAction('test-dir')
      .then(result => {
        assert.equal(result.version.value, 'my-value');
      });
  });

  it('writes the Consul key configured in the source to a <key-name> file in the destination dir it is passed', () => {
    return inAction('test-dir')
      .then(() => {
        fs.readFile('test-dir/my/key', (err, val) => {
          if (!err) {
            assert.equal(val, 'my-value');
          }
        });
      });
  });

  afterEach(done => {
    fs.remove('test-dir', err => {
      if (!err) done();
    });
  });
});
