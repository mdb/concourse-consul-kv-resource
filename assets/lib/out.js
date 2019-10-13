const Client = require('./client');
const handlers = require('./handlers');
const fs = require('fs');

function getValue(params, sourceDir) {
  return new Promise(resolve => {
    if (params.value && params.file) {
      handlers.fail(new Error('Both `file` and `value` present in params'));
    }

    if (params.file) {
      fs.readFile(`${sourceDir}/${params.file}`, (err, val) => {
        if (err) handlers.fail(err);

        resolve(val.toString().replace(/\n$/, ''));
      });

      return;
    }

    resolve(params.value);
  });
}

function outAction(sourceDir) {
  return new Promise(resolve => {
    process.stdin.on('data', stdin => {
      let data = JSON.parse(stdin);
      let source = data.source || {};
      let client = new Client(source);

      getValue(data.params, sourceDir).then(value => {
        client.set(source.key, value).then(() => {
          resolve({
            version: {
              value: value
            },
            metadata: [{
              name: 'ref',
              // timestamp in milliseconds:
              value: Date.now().toString()
            }, {
              name: 'value',
              value: value
            }]
          });
        }, rejected => {
          handlers.fail(rejected);
        });
      });
    });
  });
}

module.exports = outAction;
