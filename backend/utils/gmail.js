const nodemailer = require("nodemailer");

let transporter;
function getTransporter() {
  if (!transporter) {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error("GMAIL_USER and GMAIL_APP_PASSWORD must be configured");
    }
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

function sendMail({ to, subject, text, html }) {
  return getTransporter().sendMail({
    from: process.env.MAIL_FROM || process.env.GMAIL_USER,
    to,
    subject,
    text,
    html,
  });
}

module.exports = { sendMail };
