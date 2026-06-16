import nodemailer from "nodemailer";
import { config } from "../config/config.js";

console.log("LOGIN:", config.BREVO_LOGIN);
console.log("EMAIL:", config.BREVO_EMAIL);
console.log("SMTP:", !!config.BREVO_SMTP_KEY);
export const transporter =
nodemailer.createTransport({

 host:"smtp-relay.brevo.com",

 port:2525,

 secure:false,

 auth:{
   user:config.BREVO_LOGIN,
   pass:config.BREVO_SMTP_KEY
 },

 connectionTimeout:60000,
 greetingTimeout:60000,
 socketTimeout:60000
});