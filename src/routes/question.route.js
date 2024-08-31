import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addQuestion } from "../controllers/question.controller.js";



const router = Router()

router.route("/add-question/:quizID").post(verifyJWT, addQuestion)




export default router
