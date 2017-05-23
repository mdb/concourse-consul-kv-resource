#!/usr/bin/env node

'use strict';

const check = require('./lib/check');
const handlers = require('./lib/handlers');

check()
  .then((result) => {
    handlers.success(result);
  });
