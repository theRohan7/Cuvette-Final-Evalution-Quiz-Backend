import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    createQuiz, 
    editQuiz, 
    getAllQuiz, 
    getQuiz, 
    deleteQuiz, 
    attemptQuiz,
    quizAnalysis
} from "../controllers/quiz.controller.js";



const router = Router()

router.route("/create-quiz").post(verifyJWT, createQuiz)
router.route("/edit-quiz/:id").post(verifyJWT, editQuiz)
router.route("/").get(verifyJWT, getAllQuiz)
router.route("/:id").get( getQuiz)
router.route("/delete/:id").get(verifyJWT, deleteQuiz)
router.route("/take-quiz/:id").post(attemptQuiz)
router.route("/question-analysis/:quizID").get( verifyJWT, quizAnalysis )


export default router
