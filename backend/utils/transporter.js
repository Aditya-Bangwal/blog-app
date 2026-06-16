const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
   port: 2525,         // Changed from 587
  secure: true,       // Changed from false (true forces SSL/TLS upgrade instantly)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Add timeout parameters so it fails fast if there are network constraints
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
});

transporter.verify((err, success) => {
  if (err) {
    console.log("SMTP ERROR:", err);
  } else {
    console.log("SMTP READY");
  }
});

module.exports = transporter;