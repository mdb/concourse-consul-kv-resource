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
  let result;

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();

    mockGet();

    process.nextTick(() => {
      stdin.send(sourceJson());
    });

    return inAction('test-dir')
      .then(res => {
        result = res;
      });
  });

  it('gets the Consul key configured in the source and resolves the promise with the proper version', () => {
    assert.equal(result.version.value, 'my-value');
  });

  it('gets the Consul key configured in the source and resolves the promise with the proper metadata', () => {
    assert.equal(result.metadata[0].value, 'my-value');
  });

  it('writes the Consul key configured in the source to a <key-name> file in the destination dir it is passed', () => {
    fs.readFile('test-dir/my/key', (err, val) => {
      if (!err) {
        assert.equal(val, 'my-value');
      }
    });
  });

  afterEach(done => {
    fs.remove('test-dir', err => {
      if (!err) done();
    });
  });
});
