#!/usr/bin/env node

'use strict';

const out = require('./lib/out');

out()
  .then(result => {
    console.log(JSON.stringify(result, null, 2));
  })
  .finally(() => {
    process.exit(0);
  });
