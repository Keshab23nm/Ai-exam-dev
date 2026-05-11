import express from "express";
import {user } from "../middlewire/authmiddlewire.js";
import { isTeacher } from "../middlewire/rolemiddlewire.js";
import { getstudent, getteacher } from "../controllers/auth.controller.js";
const router = express.Router();

// Student or any logged-in user
// router.get("/user", user, (req, res) => {
//   res.json({
//     message: "User route accessed",
//     user: req.user,
//   });
// });

router.get("/user", user, getstudent);

// Teacher only




export default router;