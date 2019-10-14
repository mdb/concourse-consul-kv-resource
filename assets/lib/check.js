const Client = require('./client');

function checkAction() {
  return new Promise((resolve, reject) => {
    process.stdin.on('data', stdin => {
      const data = JSON.parse(stdin);
      const source = data.source || {};
      const client = new Client(source);
      const previousVersion = data.version && data.version.value ? data.version.value : undefined;

      client.get(source.key)
        .then(value => {
          if (!previousVersion || previousVersion !== value.value) {
            resolve([{
              value: value.value
            }]);

            return;
          }

          resolve([]);
        }, rejected => {
          reject(rejected);
        });
    });
  });
}

module.exports = checkAction;
