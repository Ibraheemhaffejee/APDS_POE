const bcrypt = require('bcryptjs');

// Replace with the actual hashed password from your database
const hashedPassword = '$2a$10$GeB1298ouN0RBsA5Bz/jvOhUc6UWSPz4krTwDENT9j1/7E4Tc9yXi';
// Replace with the plain text password you're testing
const plainPassword = 'L720811.e';

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) throw err;
  console.log(isMatch);  // True if password matches, False otherwise
});
