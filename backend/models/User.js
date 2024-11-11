const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define User Schema
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  idNumber: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    sparse: true  // Allows sparse unique indexing
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function (next) {
  console.log('Hashing password...');
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// Method to compare hashed password during login
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);


