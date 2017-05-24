'use strict';

const Client = require('./client');
const handlers = require('./handlers');

function outAction() {
  return new Promise(resolve => {
    process.stdin.on('data', stdin => {
      const data = JSON.parse(stdin);
      const source = data.source || {};
      const client = new Client(source);

      client.set(source.key, data.params.value)
        .then(value => {
          resolve({
            version: {
              // timestamp in milliseconds:
              ref: Date.now().toString()
            },
            metadata: [{
              name: 'value',
              value: data.params.value
            }]
          });
        }, rejected => {
          handlers.fail(rejected);
        });
    });
  });
}

module.exports = outAction;
