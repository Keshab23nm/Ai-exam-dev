
import nodemailer from "nodemailer";
import { config } from "../config/config.js";
export const transporter =
nodemailer.createTransport({

 host:"smtp-relay.brevo.com",

 port:587,

 secure:false,

 auth:{
   user:config.BREVO_EMAIL,
   pass:config.BREVO_SMTP_KEY
 },

 connectionTimeout:30000,

 greetingTimeout:30000,

 socketTimeout:30000
});
