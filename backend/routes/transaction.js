
const express = require('express');
const authMiddleware = require('../middlewares/authmiddleware');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  const { amount, currency, provider, swiftCode } = req.body;

  try {
    const transaction = new Transaction({
      userId: req.user.id,
      amount,
      currency,
      provider,
      swiftCode
    });
    
    await transaction.save();
    res.json({ msg: 'Transaction completed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
