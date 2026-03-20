const transporter = require("../config/email");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

const sendEmail = asyncHandler(async ({ to, subject, html }) => {
  const mailOptions = {
    from: `"BookStore App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);

  console.log("Email sent:", info.messageId);
});

module.exports = sendEmail;
