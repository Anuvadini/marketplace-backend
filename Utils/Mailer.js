// import { createTransport } from "nodemailer";

// async function sendEmail(recipient, subject, body) {
//   // Create a transporter object using the default SMTP transport
//   let transporter = createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: "anuvadini@gmail.com", // Your email
//       pass: "Anuvadini@123", // Your email account password
//     },
//   });

//   // Send mail with defined transport object
//   let info = await transporter.sendMail({
//     from: '"Anuvadini Marketplace" <anuvadini@gmail.com>', // Sender address
//     to: recipient, // List of recipients
//     subject: subject, // Subject line
//     text: body, // Plain text body
//     html: `<b>${body}</b>`, // HTML body content
//   });
// }

// // run the function
// sendEmail(
//   "konathalavamsi123@gmail.com",
//   "Test Email",
//   "This is a test email from Anuvadini Marketplace"
// );
// export default sendEmail;

import nodemailer from "nodemailer";
import axios from "axios";
const sendOTP = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  //requireTLS: true,
  auth: {
    user: "onod_support@aicte-india.org",
    pass: "omah gpot wzrd gpil",
  },
});

const sendEmailto = async (
  toEmail,
  firstName,
  time,
  businessName,
  password
) => {
  try {
    const mailOptions = {
      from: "onod_support@aicte-india.org",
      // to: toEmail,
      to: [toEmail],
      subject: "Anuvadini Marketplace-info",
      html: `Dear <b>${firstName}</b>,<br><br>
            <b>Your appointment has been scheduled on ${time} with ${businessName}</b>
            <br><br>
            <b>Your login credentials are:</b>
            <br>
            <b>Email:</b> ${toEmail}
            <br>
            <b>Password:</b> ${password}
            <p style="font-style: italic; font-size: 12px;">This E-Notification was automatically generated. Please do not reply to this mail.</p>
            <p style="font-style: italic; font-size: 12px;">"The information contained in this electronic message and any attachments to this message are intended for exclusive use of the addressee(s) and may contain confidential or privileged information. If you are not the intended recipient, please notify the sender at One Nation One Data (ONOD) at techsupport_onod@aicte-india.org immediately and destroy all copies of this message and any attachments."</p>`,
    };
    let info = await sendOTP.sendMail(mailOptions);
    console.log(info);
  } catch (error) {
    console.error("Error sending registration email:", error);
    throw error;
  }
};

export { sendEmailto };
