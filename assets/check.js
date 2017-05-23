#!/usr/bin/env node

'use strict';

const check = require('./lib/check');

check()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .finally(() => {
    process.exit(0);
  });
