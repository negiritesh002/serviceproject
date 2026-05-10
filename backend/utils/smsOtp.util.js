const https = require('https');

const formatIndianPhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.startsWith('91') && digits.length === 12) return digits;
  return `91${digits}`;
};

const isSmsOtpConfigured = () => {
  return Boolean(process.env.TWO_FACTOR_API_KEY);
};

const sendSmsOtp = async (phone, otp) => {
  if (!isSmsOtpConfigured()) {
    throw new Error('SMS OTP provider is not configured');
  }

  const apiKey = process.env.TWO_FACTOR_API_KEY;
  const formattedPhone = formatIndianPhone(phone);
  const path = `/API/V1/${apiKey}/SMS/${formattedPhone}/${otp}`;

  return new Promise((resolve, reject) => {
    const req = https.request({
      method: 'POST',
      hostname: '2factor.in',
      path
    }, (res) => {
      let body = '';

      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(body));
          } catch {
            resolve({ raw: body });
          }
          return;
        }

        reject(new Error(body || `2Factor request failed with status ${res.statusCode}`));
      });
    });

    req.on('error', reject);
    req.end();
  });
};

module.exports = {
  isSmsOtpConfigured,
  sendSmsOtp
};
