#!/usr/bin/env node

const inAction = require('./lib/in');
const handlers = require('./lib/handlers');

inAction(process.argv[2])
  .then(result => {
    handlers.success(result);
  });
