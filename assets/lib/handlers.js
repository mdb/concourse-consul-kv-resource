'use strict';

module.exports = {
  fail: function(err) {
    if (err) {
      console.error(err.stack);
    }

    process.exit(1);
  }
};
