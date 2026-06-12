
import express from "express";

import {
  registerUser,
  loginUser,
  verifyUser,
  logoutUser,
  getMyAttendance
} from '../controllers/auth.controller.js';

import { user } from "../middlewire/authmiddlewire.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.post("/logout", user,logoutUser); 
router.get("/my-attendance", user, getMyAttendance);
router.get('/me', user, (req, res) => {
  res.json({ user: req.user });
});

export default router;





























// router.post("/login", loginUser);
// router.put("/approve/:id", approveStudent);
// router.post("/verify", verifyUser);
// router.get("/student",isteacher, approveStudent);