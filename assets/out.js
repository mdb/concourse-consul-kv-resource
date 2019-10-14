#!/usr/bin/env node

const outAction = require('./lib/out');
const handlers = require('./lib/handlers');

outAction(process.argv[2])
  .then(result => {
    handlers.success(result);
  })
  .catch(problem => {
    handlers.fail(problem);
  });
