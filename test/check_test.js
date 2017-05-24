'use strict';

const assert = require('assert');
const checkAction = require('../assets/lib/check');

describe('checkAction', () => {
  let stdin;

  beforeEach(() => {
    stdin = require('mock-stdin').stdin();
  });

  it('resolves its promise on stdin with an empty array', () => {
    process.nextTick(() => {
      stdin.send('foo');
    });

    return checkAction()
      .then(result => {
        assert.equal(result.length, 0);
      }, rejected => {
        console.log('rejected: ', rejected);
      });
  });
});
