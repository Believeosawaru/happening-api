import nodemailer from "nodemailer";
import { senderEmail, emailPass } from "../config/keys.js";

const sendEmail = async ({ emailTo, subject, code, content }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: "believeosawaru2@gmail.com",
          pass: "xvvfnxiknsfwqqpn"
        },
      });
  
    const message = {
      to: emailTo,
      subject,
      html: `
              <div>
                <h3>Your 6-digit Code to ${content}</h3>
                <p>Code: ${code}</p>
              </div>
          `,
    };
  
    transporter.sendMail(message);
  
    console.log("sent successfully");
  };

export default sendEmail;