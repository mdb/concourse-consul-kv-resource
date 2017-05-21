#!/usr/bin/env node

'use strict';

const Client = require('./client');
const handlers = require('./handlers');
const destDir = process.argv[2];

process.stdin.on('data', stdin => {
  const data = JSON.parse(stdin);
  const source = data.source || {};
  const client = new Client(source);

  client.get(source.key)
    .then(value => {
      fs.writeFile(`${destDir/source.key}`, value, (err) => {
        if (err) console.log(err);

        handlers.success({
          version: {
            value: value,
            // timestamp in milliseconds:
            ref: Date.now()
          }
        });
      });
    }, rejected => {
      handlers.fail(new Error(`failed to get key ${source.key}`));
    });
});