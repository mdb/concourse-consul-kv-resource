const Client = require('./client');
const handlers = require('./handlers');

function checkAction() {
  return new Promise(resolve => {
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
          handlers.fail(rejected);
        });
    });
  });
}

module.exports = checkAction;
