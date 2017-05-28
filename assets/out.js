#!/usr/bin/env node

'use strict';

const outAction = require('./lib/out');
const handlers = require('./lib/handlers');

outAction(process.argv[2])
  .then(result => {
    handlers.success(result);
  });
