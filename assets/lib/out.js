const Client = require('./client');
const fs = require('fs');

function getValue(params, sourceDir) {
  return new Promise((resolve, reject) => {
    if (!params || (!params.value && !params.file)) {
      reject(new Error('Must pass required \'file\' or \'value\' params'));
      return;
    }

    if (params.value && params.file) {
      reject(new Error('Both \'file\' and \'value\' are present in params'));
      return;
    }

    if (params.value) {
      resolve(params.value);
      return;
    }

    if (params.file) {
      fs.readFile(`${sourceDir}/${params.file}`, (err, val) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(val.toString().replace(/\n$/, ''));
        return;
      });
    }
  });
}

function outAction(sourceDir) {
  return new Promise((resolve, reject) => {
    process.stdin.on('data', stdin => {
      const data = JSON.parse(stdin);
      const source = data.source || {};
      const client = new Client(source);

      getValue(data.params, sourceDir)
        .then(value => {
          client.set(source.key, value)
            .then(() => {
              resolve({
                version: {
                  value: value
                },
                metadata: [{
                  name: 'timestamp',
                  // timestamp in milliseconds:
                  value: Date.now().toString()
                }, {
                  name: 'value',
                  value: value
                }]
              });
            })
            .catch(err => {
              reject(err);
            });
        })
        .catch(err => {
          reject(err);
        });
    });
  });
}

module.exports = outAction;
