import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createQuiz, editQuiz, getAllQuiz, getQuiz, deleteQuiz } from "../controllers/quiz.controller.js";



const router = Router()

router.route("/create-quiz").post(verifyJWT, createQuiz)
router.route("/edit-quiz/:id").post(verifyJWT, editQuiz)
router.route("/").get(verifyJWT, getAllQuiz)
router.route("/:id").get(verifyJWT, getQuiz)
router.route("/delete/:id").get(verifyJWT, deleteQuiz)


export default router
