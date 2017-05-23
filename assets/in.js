#!/usr/bin/env node

'use strict';

const fs = require('fs-extra');
const Client = require('./client');
const handlers = require('./handlers');
const destDir = process.argv[2];

process.stdin.on('data', stdin => {
  const data = JSON.parse(stdin);
  const source = data.source || {};
  const client = new Client(source);
  const file = `${destDir}/${source.key}`

  client.get(source.key)
    .then(value => {
      fs.ensureFile(file, (err) => {
        if (err) handlers.fail(err);

        fs.writeFile(file, value.value, (err) => {
          if (err) handlers.fail(err);

          handlers.success({
            version: {
              value: value,
              // timestamp in milliseconds:
              ref: Date.now().toString()
            }
          });
        });
      });
    }, rejected => {
      handlers.fail(rejected);
    });
});
