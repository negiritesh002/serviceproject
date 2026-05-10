const crypto = require('crypto');

const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const otpStore = new Map();

const generateOtp = () => {
  return String(crypto.randomInt(100000, 1000000));
};

const normalizeOtpKey = (value) => {
  return String(value || '').trim().toLowerCase();
};

const saveOtp = (key, otp) => {
  otpStore.set(normalizeOtpKey(key), {
    otp,
    expiresAt: Date.now() + OTP_EXPIRY_MS,
    attemptsLeft: MAX_ATTEMPTS
  });
};

const verifyOtp = (key, otp) => {
  const normalizedKey = normalizeOtpKey(key);
  const entry = otpStore.get(normalizedKey);

  if (!entry) {
    return { valid: false, message: 'Please request a new OTP' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(normalizedKey);
    return { valid: false, message: 'OTP has expired. Please request a new one' };
  }

  if (entry.otp !== otp) {
    entry.attemptsLeft -= 1;

    if (entry.attemptsLeft <= 0) {
      otpStore.delete(normalizedKey);
      return { valid: false, message: 'Too many invalid attempts. Please request a new OTP' };
    }

    return { valid: false, message: `Invalid OTP. ${entry.attemptsLeft} attempt(s) remaining` };
  }

  otpStore.delete(normalizedKey);
  return { valid: true };
};

const clearOtp = (key) => {
  otpStore.delete(normalizeOtpKey(key));
};

module.exports = {
  generateOtp,
  saveOtp,
  verifyOtp,
  clearOtp,
  OTP_EXPIRY_MS
};
