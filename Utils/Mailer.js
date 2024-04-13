import { createTransport } from "nodemailer";

async function sendEmail(recipient, subject, body) {
  // Create a transporter object using the default SMTP transport
  let transporter = createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "anuvadini@gmail.com", // Your email
      pass: "Anuvadini@123", // Your email account password
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Anuvadini Marketplace" <anuvadini@gmail.com>', // Sender address
    to: recipient, // List of recipients
    subject: subject, // Subject line
    text: body, // Plain text body
    html: `<b>${body}</b>`, // HTML body content
  });
}

// run the function
sendEmail(
  "voidexception15@gmail.com",
  "Test Email",
  "This is a test email from Anuvadini Marketplace"
);
export default sendEmail;
