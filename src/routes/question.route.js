import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createQuestion } from "../controllers/question.controller.js";



const router = Router()

router.route("/create-question").post(verifyJWT, createQuestion)



export default router
