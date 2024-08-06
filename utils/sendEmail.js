import nodemailer from "nodemailer";
import { senderEmail, emailPass } from "../config/keys.js";

const sendEmail = async ({emailTo, subject, code, content}) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: senderEmail,
            pass: emailPass
        }
    });

    const message  = {
        to: emailTo,
        subject,
        html: `
        <div>
          <h3>Use The Code Below To Verify Your Account</h3>
          <p><strong>Code: ${code}</strong></p>
        </div>
        `
    }

    await transporter.sendMail(message);
}

export default sendEmail;