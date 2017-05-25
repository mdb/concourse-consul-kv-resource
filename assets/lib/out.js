'use strict';

const Client = require('./client');
const handlers = require('./handlers');
const fs = require('fs');
const path = require('path');

function getValue(params) {
  return new Promise(resolve => {
    if (params.value && params.file) {
      handlers.fail(new Error('Both `file` and `value` present in params'));
    }

    if (params.file) {
      fs.readFile(path.resolve(params.file), (err, val) => {
        if (err) handlers.fail(err);

        resolve(val.toString().replace(/\n$/, ''));
      });
    } else {
      resolve(params.value);
    }
  });
}

function outAction() {
  return new Promise(resolve => {
    process.stdin.on('data', stdin => {
      let data = JSON.parse(stdin);
      let source = data.source || {};
      let client = new Client(source);

      getValue(data.params).then(value => {
        client.set(source.key, value)
          .then(result => {
            resolve({
              version: {
                // timestamp in milliseconds:
                ref: Date.now().toString()
              },
              metadata: [{
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
