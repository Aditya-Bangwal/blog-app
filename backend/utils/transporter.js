const nodemailer = require("nodemailer");
const { SMTP_USER, SMTP_PASS } = require("../config/dotenv.config");
require("dotenv").config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

module.exports=transporter