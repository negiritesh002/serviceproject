// Generate 6-digit OTP
const generateOTPCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const isTwilioConfigured = () => {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE &&
    !process.env.TWILIO_ACCOUNT_SID.includes('your_') &&
    !process.env.TWILIO_AUTH_TOKEN.includes('your_')
  );
};

const formatIndianPhone = (phone) => {
  const normalized = String(phone || '').replace(/\D/g, '');
  if (normalized.startsWith('91') && normalized.length === 12) return `+${normalized}`;
  return `+91${normalized}`;
};

// Send OTP via Twilio
const sendOTP = async (phone, otp, purpose = 'signup') => {
  const purposeMessages = {
    signup: `Welcome to ServiceBook! Your OTP for signup is: ${otp}. Valid for 10 minutes.`,
    login: `Your ServiceBook login OTP is: ${otp}. Valid for 10 minutes.`,
    reset_password: `Your ServiceBook password reset OTP is: ${otp}. Valid for 10 minutes.`
  };

  if (!isTwilioConfigured()) {
    throw new Error('Twilio SMS is not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE.');
  }

  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  await client.messages.create({
    body: purposeMessages[purpose] || `Your OTP is: ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: formatIndianPhone(phone)
  });

  console.log(`OTP sent to ${phone} for ${purpose}`);
  return { success: true, message: 'OTP sent successfully' };
};

// Send booking notification SMS to vendor
const sendBookingSMS = async (phone, bookingDetails) => {
  const { customerName, serviceTitle, scheduledDate, scheduledTime, bookingId } = bookingDetails;
  const message = `ServiceBook: New booking request from ${customerName} for ${serviceTitle} on ${new Date(scheduledDate).toLocaleDateString()} at ${scheduledTime}. Booking ID: ${bookingId}. Login to accept/reject.`;

  if (!isTwilioConfigured()) {
    console.warn('Booking SMS skipped: Twilio SMS is not configured.');
    return { success: false, message: 'Twilio SMS is not configured' };
  }

  const twilio = require('twilio');
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

  await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: formatIndianPhone(phone)
  });

  console.log(`Booking SMS sent to ${phone}`);
  return { success: true, message: 'Booking SMS sent' };
};

module.exports = { generateOTPCode, sendOTP, sendBookingSMS };
