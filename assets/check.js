#!/usr/bin/env node

const checkAction = require('./lib/check');
const handlers = require('./lib/handlers');

checkAction()
  .then((result) => {
    handlers.success(result);
  });
