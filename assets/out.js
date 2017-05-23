#!/usr/bin/env node

'use strict';

const out = require('./lib/out');
const handlers = require('./lib/handlers');

out()
  .then(result => {
    handlers.success(result);
  });
