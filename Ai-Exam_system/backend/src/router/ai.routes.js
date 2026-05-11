import express from "express";
import { createExamFromPrompt } from "../controllers/ai.controller.js";
import {user} from "../middlewire/authmiddlewire.js";
import { isTeacher } from "../middlewire/rolemiddlewire.js";
import {listModels} from "../controllers/findmodel.controller.js";

const router = express.Router();

router.post("/create-from-prompt", user, isTeacher, createExamFromPrompt);
router.get("/models", user, isTeacher, listModels);

export default router;