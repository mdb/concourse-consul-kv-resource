#!/usr/bin/env node

'use strict';

const handlers = require('./handlers');

process.stdin.on('data', stdin => {
  handlers.success([]);
});
