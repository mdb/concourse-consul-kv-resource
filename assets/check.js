#!/usr/bin/env node

'use strict';

const checkAction = require('./lib/check');
const handlers = require('./lib/handlers');

checkAction()
  .then((result) => {
    handlers.success(result);
  });
