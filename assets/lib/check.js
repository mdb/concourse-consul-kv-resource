'use strict';

const Client = require('./client');
const handlers = require('./handlers');

function checkAction() {
  return new Promise(resolve => {
    process.stdin.on('data', stdin => {
      let data = JSON.parse(stdin);
      let source = data.source || {};
      let client = new Client(source);

      client.get(source.key)
        .then(value => {
          resolve([{
            ref: Date.now().toString()
          }]);
        }, rejected => {
          handlers.fail(rejected)
        });
    });
  });
}

module.exports = checkAction;
