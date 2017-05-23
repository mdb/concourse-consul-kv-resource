#!/usr/bin/env node

'use strict';

const in = require('./lib/in');

in(process.argv[2])
  .then(result => {
    console.log(JSON.stringify(result, null, 2));
  })
  .finally(() => {
    process.exit(0);
  });
