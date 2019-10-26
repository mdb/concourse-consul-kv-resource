const Client = require('./client');

function inAction() {
  return new Promise((resolve, reject) => {
    process.stdin.on('data', stdin => {
      const data = JSON.parse(stdin);
      const source = data.source || {};
      const client = new Client(source);

      client.get(source.key)
        .then(value => {
          resolve({
            version: {
              value: value.value
            },
            metadata: [{
              name: 'value',
              value: value.value
            }]
          });
        })
        .catch(rejected => {
          reject(rejected);
        });
    });
  });
}

module.exports = inAction;
