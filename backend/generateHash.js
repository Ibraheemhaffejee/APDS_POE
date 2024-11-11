const bcrypt = require('bcryptjs');

const plainPassword = 'L720811.e';  // Use the password you're testing

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(plainPassword, salt, (err, hash) => {
    if (err) throw err;
    console.log('Generated Hash: ', hash);
  });
});
