import nodemailer from "nodemailer";
import { senderEmail, emailPass } from "../config/keys.js";

const sendGroupMail = async ({ emailTo, subject }, { groupName, groupLocation, createdBy, inviteLink }) => {
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
      text: `You have been invited to a group: ${groupName}. \n\n
      group Details: \nName: ${groupName}\nLocation: ${groupLocation}\nInvited By: ${createdBy}`,
      html: `
              <div>
                <h3>Click the link below to join the group</h3>
                <p><a href="${inviteLink}">Join Group</a></p>
              </div>
          `,
    };
  
    transporter.sendMail(message);
};

export default sendGroupMail;