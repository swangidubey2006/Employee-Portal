const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (to, fullName) => {
  const mailOptions = {
    from: `"GYANYUG Employee Portal" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Congratulations! Your Employee Portal Account Has Been Created",

    text: `Congratulations ${fullName}!

Your Employee Portal account has been successfully created.

You can now log in using your registered email address.

Welcome to GYANYUG Employee Portal!

Regards,
GYANYUG Employee Portal`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendWelcomeEmail };