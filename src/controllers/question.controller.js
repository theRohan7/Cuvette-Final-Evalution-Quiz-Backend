import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Question } from "../models/question.model.js";
import { Quiz } from "../models/quiz.model.js";



const addQuestion = asyncHandler( async(req, res) =>{
    const {quizId, questionText, optionType,option, timer} = req.body

    if(questionText === ""){
        throw new ApiError(403, "Question is required.")
    }
    if(timer === null){
        throw new ApiError(403, "Time is required.")
    }
    if(optionType === ""){
        throw new ApiError(403, "Option Type is required.")
    }

    const quiz = await Quiz.findById(quizId);

    if(!quiz){
        throw new ApiError(404, "Quiz not found")
    }
    
    if(quiz.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized to add question")
    }

    const question = await Question.create({
        questionText,
        optionType,
        option,
        quizId,
        timer,
    })

    const createdQuestion = await Question.findById(question._id)

    if(!createdQuestion){
        throw new ApiError(500, "Something went wrong while creating Question.")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, createdQuestion, "Question created successfully."))
   
})






export { 
    addQuestion,
 }