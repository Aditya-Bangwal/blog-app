require("dotenv").config();
const { BrevoClient } = require("@getbrevo/brevo");


const brevo = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
  
});

async function sendEmail(to, subject, htmlContent) {
    console.log("BREVO KEY:", process.env.BREVO_API_KEY);
    console.log("SENDER:", "adityabangwal12@gmail.com");
    console.log("SENDING EMAIL WITH:");
console.log({
  sender: {
    name: "Blog App",
    email: "adityabangwal12@gmail.com",
  },
  to,
});
  const result = await brevo.transactionalEmails.sendTransacEmail({
    sender: {
      name: "Blog App",
      email: "adityabangwal12@gmail.com",
    },
    to: [
      {
        email: to,
      },
    ],
    subject,
    htmlContent,
  });

  console.log("EMAIL SENT:", result.messageId);
  

  return result;
}

module.exports = sendEmail;