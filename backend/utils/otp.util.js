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

module.exports = { sendBookingSMS };
