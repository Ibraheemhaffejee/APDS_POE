
const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  currency: String,
  provider: String,
  swiftCode: String
});

module.exports = mongoose.model('Transaction', TransactionSchema);
