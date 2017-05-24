'use strict';

function checkAction() {
  return new Promise(resolve => {
    process.stdin.on('data', stdin => {
      resolve([]);
    });
  });
}

module.exports = checkAction;
