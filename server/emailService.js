const nodemailer = require("nodemailer");

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error(
      "Email is not configured. Set EMAIL_USER and EMAIL_PASS in server/.env."
    );
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendWelcomeEmail = async (to, fullName) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"GYANYUG Employee Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to GYANYUG Employee Portal",
    text: `Congratulations ${fullName}!

Your Employee Portal account has been successfully created.

You can now log in using your registered email address.

Welcome to GYANYUG Employee Portal!

Regards,
GYANYUG Employee Portal`,
  });
};

module.exports = { sendWelcomeEmail };
