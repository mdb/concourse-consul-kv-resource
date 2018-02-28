'use strict';

const fs = require('fs-extra');
const Client = require('./client');
const handlers = require('./handlers');

function inAction(destDir) {
  return new Promise(resolve => {
    process.stdin.on('data', stdin => {
      let data = JSON.parse(stdin);
      let source = data.source || {};
      let client = new Client(source);
      let file = `${destDir}/${source.key}`;

      client.get(source.key)
        .then(value => {
          fs.ensureFile(file, (err) => {
            if (err) handlers.fail(err);

            fs.writeFile(file, value.value, (err) => {
              if (err) handlers.fail(err);

              resolve({
                version: {
                  value: value.value,
                  // timestamp in milliseconds:
                  ref: Date.now().toString()
                }
              });
          });
        });
      }, rejected => {
        handlers.fail(rejected)
      });
    });
  });
}

module.exports = inAction;
