import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Question } from "../models/question.model.js";
import { Option } from "../models/question.model.js";


const createQuestion = asyncHandler( async(req, res) =>{
    const {quizId, questionText, optionType, time} = req.body

    if(questionText === ""){
        throw new ApiError(403, "Question is required.")
    }
    if(time === null){
        throw new ApiError(403, "Time is required.")
    }
    if(optionType === ""){
        throw new ApiError(403, "Option Type is required.")
    }

    const question = await Question.create({
        questionText,
        optionType,
        quizId,
        time,
    })

    const createdQuestion = await Question.findById(question._id)

    if(!createdQuestion){
        throw new ApiError(500, "Something went wrong while creating Question.")
    }

    return res
    .status(200)
    .json( new ApiResponse(200, createdQuestion, "Question created successfully."))
   
})





export { createQuestion }