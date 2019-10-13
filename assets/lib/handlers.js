module.exports = {
  fail: function(err) {
    if (err) {
      console.error(err.stack);
    }

    process.exit(1);
  },

  success: function(result) {
    console.log(JSON.stringify(result, null, 2));

    process.exit(0);
  }
};
