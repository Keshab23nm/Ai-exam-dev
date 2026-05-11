import  jwt from 'jsonwebtoken';
import User from "../models/user.js";

// export function isteacher(req, res, next) {
//     const token = req.cookies.token;
//     // Implement teacher verification logic here
//   if(!token){
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
   
//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   if(decoded.ueserRole !== 'teacher'){
//     return res.status(403).json({ message: 'Forbidden' });
//   }
  
//   console.log(decoded.ueserRole);

//   next();
// }



// export const protect = async (req, res, next) => {
//   try {
//     let token;

//     // Check token from header  
//     if (req.headers.authorization?.startsWith("Bearer")) {
//       token = req.headers.authorization.split(" ")[1];

//       if(!token){
//         return res.status(401).json({ message: "Not authorized, no token" });
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       // Get full user from DB
//       req.user = await User.findById(decoded.id).select("-password");

//       next();
//     } else {
//       return res.status(401).json({ message: "Not authorized, no token" });
//     }
//   } catch (error) {
//     return res.status(401).json({ message: "Token failed" });
//   }
// };


export const user=async (req,res,next) => {
  const token = req.cookies.token;
  if(!token){
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}
