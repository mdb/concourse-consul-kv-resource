#!/usr/bin/env node

'use strict';

const Client = require('./client');
const handlers = require('./handlers');

process.stdin.on('data', stdin => {
  const data = JSON.parse(stdin);
  const source = data.source || {};
  const client = new Client(source);

  client.get(source.key)
    .then(value => {
      handlers.success([])
    }, rejected => {
      handlers.fail(rejected);
    });
});
