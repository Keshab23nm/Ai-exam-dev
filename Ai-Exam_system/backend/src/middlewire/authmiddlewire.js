import  jwt from 'jsonwebtoken';
import User from "../models/user.js";


// export const user=async (req,res,next) => {
//   const token = req.cookies.token;
//   if(!token){
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
// }

export const user = async (req,res,next)=>{

  console.log("Cookies received:", req.cookies);

  const token = req.cookies.token;

  console.log("Token:", token);

  if(!token){
    return res.status(401).json({
      message:"Unauthorized no token"
    });
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded:", decoded);

    req.user = await User.findById(decoded.id)
      .select("-password");

    next();

  } catch(err){

    console.log("JWT ERROR:", err);

    return res.status(401).json({
      message:"Invalid token"
    });
  }
};