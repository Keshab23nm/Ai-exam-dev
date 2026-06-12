import User from '../models/user.js';
import Attendance from '../models/qrModel.js';
import jwt from 'jsonwebtoken';
import cookies from 'cookie-parser';
import bcrypt from "bcryptjs";
import {config }from '../config/config.js';
import { transporter } from '../utils/emailotpsend.js';



export const registerUser = async (req, res) => {
  try {
    const { name, email, password, class: studentClass } = req.body;

    // Validate required fields
    if (!name || !email || !password || !studentClass) {
      return res.status(400).json({ message: "All fields are required: name, email, password, and class" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      class: studentClass,
      otp,
    });

    const mailOptions = {
      from: config.OTP_EMAIL,
      to: user.email,
      subject: "🔐 Your Verification Code - ExamiSystem",
      html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <div style="background-color: #4F46E5; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 1px;">ExamiSystem</h1>
        </div>
        <div style="padding: 40px; background-color: #ffffff;">
          <h2 style="color: #333; margin-top: 0;">Hello ${user.name},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">Thank you for joining ExamiSystem! To complete your registration and secure your account, please use the following verification code:</p>
          <div style="text-align: center; margin: 40px 0;">
            <div style="display: inline-block; background-color: #f3f4f6; padding: 20px 40px; border-radius: 10px; border: 2px dashed #4F46E5;">
              <span style="font-size: 36px; font-weight: bold; color: #4F46E5; letter-spacing: 10px;">${otp}</span>
            </div>
          </div>
          <p style="color: #666; font-size: 14px; line-height: 1.5;">This code will expire shortly. If you did not request this code, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} ExamiSystem. All rights reserved.</p>
        </div>
      </div>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
        return res.status(500).json({
          message: "Error sending email",
        });
      }

      console.log("Email sent: ", info.response);
      console.log("Account OTP:", otp);

      return res.status(200).json({
        message: "Registered successfully. Check email for OTP.",
      });
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};


export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;

    await user.save();

    res.json({ message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: "Please verify your email first",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Production-ready cookie settings
    const isProduction = process.env.NODE_ENV === "production";
    
    res.cookie("token", token, { 
      httpOnly: true,
      secure: isProduction, // Only true in production
      sameSite: isProduction ? "none" : "lax", // Lax for localhost, None for cross-domain prod
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const logoutUser = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  res.json({ message: "Logged out successfully" });
};




export const getstudent=(req,res)=>{
  res.json({
    message:"get student route accessed",
    user:req.user,
  });
}


export const getteacher=(req,res)=>{
  res.json({
    message:"get teacher route accessed",
    user:req.user,
  });
}

export const getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { date } = req.query;
    
    let query = { userId: studentId };
    if (date) {
      query.date = date;
    }

    const history = await Attendance.find(query)
      .sort({ _id: -1 })
      .limit(30); 
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// export async function register(req,res){
//     // Implement registration logic here
//     const { name, email, password, className } = req.body;

//      const user = await User.create({ name, email, password, className });

//      const token=jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.cookie('token', token, { httpOnly: true });

//        res.status(201).json({
//         message: 'User registered successfully',
//         token,
//        });

// }

// export  async function login(req, res) {
//     // Implement login logic here
//     const { email, password } = req.body;
//      const user = await User.findOne({ email });
//      if(!user){
//         return res.status(404).json({ message: 'User not found' });
//      }
//   const token=jwt.sign({ id: user._id ,ueserRole: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });

//   res.cookie('token', token, { httpOnly: true });

//   res.status(200).json({
//     message: 'Login successful',
//     token,
//   });

// }


export async function approveStudent(req, res) {
    // Implement student approval logic here
   //  const { className } = req.query;
    const user = await User.find({ className:"4class"});

    res.status(200).json({
         message: 'Student approved successfully',
         user,
      });
}