const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  identifier: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['phone', 'email'],
    default: 'phone'
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['signup', 'login', 'reset_password', 'verify'],
    default: 'signup'
  },
  userType: {
    type: String,
    enum: ['customer', 'vendor'],
    default: 'customer'
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true
});

otpSchema.index({ identifier: 1, purpose: 1 });

module.exports = mongoose.model('OTP', otpSchema);