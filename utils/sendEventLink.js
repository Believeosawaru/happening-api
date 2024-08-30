import nodemailer from "nodemailer";
import { senderEmail, emailPass } from "../config/keys.js";

const sendEventMail = async ({ emailTo, subject }, { eventName, eventDate, eventTime, eventLocation, inviteLink }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: senderEmail,
          pass: emailPass
        },
      });
  
    const message = {
      to: emailTo,
      subject,
      text: `You have been invited to the event: ${eventName}. \n\n
      Event Details: \nName: ${eventName}\nDate & Time: ${eventDate} ${new Date(eventTime).toLocaleString()}\nLocation: ${eventLocation}`,
      html: `
              <div>
                <h3>Click the link below to join the event</h3>
                <p><a href="${inviteLink}">Join Event</a></p>
              </div>
          `,
    };
  
    transporter.sendMail(message);
};

export default sendEventMail;