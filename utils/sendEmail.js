import nodemailer from "nodemailer";
import { senderEmail, emailPass } from "../config/keys.js";

const sendEmail = async ({from, emailTo, subject, code, content}) => {
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
        from,
        to: emailTo,
        subject,
        html: `
        <div>
          <h3>Use The Code Below To ${content}</h3>
          <p><strong>Code: ${code}</strong></p>
        </div>
        `
    }

    try {
        await transporter.sendMail(message);
        console.log("Sent Successfully");
    } catch (error) {
        console.log(error.message);
    }
}

export default sendEmail;