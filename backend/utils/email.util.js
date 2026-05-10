const nodemailer = require('nodemailer');

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: String(process.env.EMAIL_SECURE || 'false') === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const isEmailConfigured = () => {
  return Boolean(
    process.env.EMAIL_HOST &&
    process.env.EMAIL_PORT &&
    process.env.EMAIL_USER &&
    process.env.EMAIL_PASS
  );
};

const sendCustomerOtpEmail = async (customerEmail, customerName, otp) => {
  if (!isEmailConfigured()) {
    throw new Error('Email OTP is not configured');
  }

  const transporter = getTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: customerEmail,
    subject: 'Your ServiceBook OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Verify your ServiceBook account</h2>
        <p>Hi ${customerName || 'there'},</p>
        <p>Your one-time password for signup is:</p>
        <div style="margin: 24px 0; text-align: center;">
          <span style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #111827; background: #f3f4f6; padding: 16px 24px; border-radius: 12px;">
            ${otp}
          </span>
        </div>
        <p>This OTP will expire in 10 minutes.</p>
        <p style="color: #6b7280; font-size: 14px;">
          If you did not request this, you can safely ignore this email.
        </p>
      </div>
    `
  });
};

// Send booking notification to vendor
const sendBookingNotification = async (vendorEmail, bookingDetails) => {
  if (!isEmailConfigured()) {
    console.warn('Booking email skipped: email is not configured.');
    return;
  }

  const transporter = getTransporter();
  const { customerName, serviceTitle, scheduledDate, scheduledTime, address, bookingId } = bookingDetails;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: vendorEmail,
    subject: 'New Booking Request - ServiceBook',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">New Booking Request</h2>
        <p>Hi there,</p>
        <p>You have received a new booking request from <strong>${customerName}</strong>.</p>

        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #374151;">Booking Details:</h3>
          <p><strong>Service:</strong> ${serviceTitle}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Date:</strong> ${new Date(scheduledDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${scheduledTime}</p>
          <p><strong>Address:</strong> ${address.street}, ${address.city}, ${address.state} ${address.pincode}</p>
          <p><strong>Booking ID:</strong> ${bookingId}</p>
        </div>

        <p>Please login to your dashboard to accept or reject this booking.</p>

        <div style="margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/vendor/bookings"
             style="background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Booking
          </a>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          This is an automated message from ServiceBook. Please do not reply to this email.
        </p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Booking notification sent to ${vendorEmail}`);
  } catch (error) {
    console.error('Email notification error:', error.message);
  }
};

module.exports = {
  isEmailConfigured,
  sendCustomerOtpEmail,
  sendBookingNotification
};
