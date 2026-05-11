import dotenv from 'dotenv';

dotenv.config();

 export const config = {
    PORT:process.env.PORT,
    MONGO_URI:process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET, 
    GEMINI_API_KEY:process.env.GEMINI_API_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID, // Add here
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET, // Add here
  OTP_EMAIL: process.env.OTP_EMAIL, // Add here
  OTP_PASSWORD: process.env.OTP_PASSWORD, // Add here
}

// console.log(process.env.GEMINI_API_KEY)