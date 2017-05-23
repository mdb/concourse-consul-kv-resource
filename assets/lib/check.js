'use strict';

function check() {
  return new Promise(resolve => {
    process.stdin.on('data', stdin => {
      resolve([]);
    });
  });
}

module.exports = check;
