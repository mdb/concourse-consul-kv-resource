const fs = require('fs-extra');
const Client = require('./client');
const handlers = require('./handlers');

function inAction(destDir) {
  return new Promise(resolve => {
    process.stdin.on('data', stdin => {
      const data = JSON.parse(stdin);
      const source = data.source || {};
      const client = new Client(source);
      const file = `${destDir}/${source.key}`;

      client.get(source.key).then(value => {
        fs.ensureFile(file, (err) => {
          if (err) handlers.fail(err);

          fs.writeFile(file, value.value, (err) => {
            if (err) handlers.fail(err);

            resolve({
              version: {
                value: value.value
              },
              metadata: []
            });
          });
        });
      }, rejected => {
        handlers.fail(rejected);
      });
    });
  });
}

module.exports = inAction;
