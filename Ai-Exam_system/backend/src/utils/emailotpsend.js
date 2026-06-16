import nodemailer from "nodemailer";
import { config } from "../config/config.js";

console.log(config.BREVO_EMAIL);
console.log(!!config.BREVO_SMTP_KEY);
export const transporter =
nodemailer.createTransport({

 host:"smtp-relay.brevo.com",

 port:587,

 secure:false,

 auth: {
   user: config.BREVO_LOGIN,

   pass: config.BREVO_SMTP_KEY
 }
});