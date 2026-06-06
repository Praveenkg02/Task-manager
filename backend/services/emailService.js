const nodemailer = require('nodemailer');

const getTransporter = () => {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendEmail = async (to, subject, html) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`\n  EMAIL (${subject}) to ${to}:`);
    console.log(`  ${html.replace(/<[^>]*>/g, '')}\n`);
    return { sent: false, logged: true };
  }
  await transporter.sendMail({ from: process.env.SMTP_USER, to, subject, html });
  return { sent: true };
};

const sendPasswordResetEmail = async (to, resetUrl) => {
  const html = `
    <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;background:#faf6ef;padding:32px;border-radius:8px;border-left:4px solid #c9a96e;">
      <h2 style="font-family:'Caveat',cursive;color:#3b2f2a;text-align:center;border-bottom:2px solid #c9a96e;padding-bottom:8px;">&#x1F4DD; Task Journal</h2>
      <p style="color:#2c3e50;font-size:16px;">You requested a password reset.</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${resetUrl}" style="display:inline-block;background:#c9a96e;color:#fff;padding:12px 28px;border-radius:4px;text-decoration:none;font-size:16px;font-weight:bold;">Reset Password</a>
      </p>
      <p style="color:#5a4e3e;font-size:14px;">This link expires in 15 minutes.</p>
      <p style="color:#8a7a6a;font-size:13px;">If you did not request this, ignore this email.</p>
    </div>`;
  return sendEmail(to, 'Password Reset - Task Journal', html);
};

const sendVerificationEmail = async (to, verifyUrl) => {
  const html = `
    <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;background:#faf6ef;padding:32px;border-radius:8px;border-left:4px solid #c9a96e;">
      <h2 style="font-family:'Caveat',cursive;color:#3b2f2a;text-align:center;border-bottom:2px solid #c9a96e;padding-bottom:8px;">&#x1F4DD; Task Journal</h2>
      <p style="color:#2c3e50;font-size:16px;">Welcome! Verify your email to get started.</p>
      <p style="text-align:center;margin:24px 0;">
        <a href="${verifyUrl}" style="display:inline-block;background:#c9a96e;color:#fff;padding:12px 28px;border-radius:4px;text-decoration:none;font-size:16px;font-weight:bold;">Verify Email</a>
      </p>
      <p style="color:#5a4e3e;font-size:14px;">This link expires in 24 hours.</p>
      <p style="color:#8a7a6a;font-size:13px;">If you did not create an account, ignore this email.</p>
    </div>`;
  return sendEmail(to, 'Verify Email - Task Journal', html);
};

module.exports = { sendPasswordResetEmail, sendVerificationEmail };
