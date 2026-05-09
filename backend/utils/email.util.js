const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send booking notification to vendor
const sendBookingNotification = async (vendorEmail, bookingDetails) => {
  const { customerName, serviceTitle, scheduledDate, scheduledTime, address, bookingId } = bookingDetails;

  const mailOptions = {
    from: process.env.EMAIL_USER,
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
    console.log(`📧 Booking notification sent to ${vendorEmail}`);
  } catch (error) {
    console.error('❌ Email notification error:', error.message);
    // Don't throw error to prevent booking failure
  }
};

module.exports = {
  sendBookingNotification
};
