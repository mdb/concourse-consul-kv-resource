#!/usr/bin/env node

'use strict';

const outAction = require('./lib/out');
const handlers = require('./lib/handlers');

outAction()
  .then(result => {
    handlers.success(result);
  });
