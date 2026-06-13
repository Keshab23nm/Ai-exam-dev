// import nodemailer from 'nodemailer';
// import {config} from '../config/config.js';
//  export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.OTP_EMAIL,
//     pass: process.env.OTP_PASSWORD,
//   },
// });


import nodemailer from "nodemailer";
import { config } from "../config/config.js";

export const transporter = nodemailer.createTransport({

 service: "gmail",

 auth: {
   user: config.OTP_EMAIL,
   pass: config.OTP_PASSWORD?.replace(/\s/g, "")
 },

 connectionTimeout: 30000,
 greetingTimeout: 30000
});


// import nodemailer from 'nodemailer';
// import {config} from '../config/config.js';
// export const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: config.OTP_EMAIL, // the email you used to create app password
//     pass: config.OTP_PASSWORD, // your generated app password
//   },
// });
