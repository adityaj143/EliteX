const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true
  },
  merchantName: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["Entertainment", "Utilities", "Health", "Software", "Food", "Other"]
  },
  usageFrequency: {
    type: String,
    enum: ["rarely", "sometimes", "daily"]
  },
  dateStarted: {
    type: Date
  },
  isRecurring: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
