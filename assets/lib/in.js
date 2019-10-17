const fs = require('fs-extra');
const Client = require('./client');

function inAction(destDir) {
  return new Promise((resolve, reject) => {
    process.stdin.on('data', stdin => {
      const data = JSON.parse(stdin);
      const source = data.source || {};
      const client = new Client(source);
      const file = `${destDir}/${source.key}`;

      client.get(source.key).then(value => {
        fs.ensureFile(file, err => {
          if (err) {
            reject(err);

            return;
          }

          fs.writeFile(file, value.value, err => {
            if (err) {
              reject(err);

              return;
            }

            resolve({
              version: {
                value: value.value
              },
              metadata: [{
                name: 'value',
                value: value.value
              }]
            });
          });
        });
      }, rejected => {
        reject(rejected);
      });
    });
  });
}

module.exports = inAction;
