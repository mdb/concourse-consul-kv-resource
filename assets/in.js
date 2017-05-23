#!/usr/bin/env node

'use strict';

const in = require('./lib/in');
const handlers = require('./lib/handlers');

in(process.argv[2])
  .then(result => {
    handlers.success(result);
  });
