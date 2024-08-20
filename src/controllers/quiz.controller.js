import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Quiz } from "../models/quiz.model.js"
import { Question } from "../models/question.model.js";


const createQuiz = asyncHandler( async(req, res) =>{
    const  {name, quizType} = req.body

    if(!name && !quizType){
        throw new ApiError(500, "name and quiz type required")
    }

    const user = req.user
    const owner = user._id
    
    

    const quiz = await Quiz.create({name, quizType, owner})

    const createdQuiz = await Quiz.findById(quiz._id)

    if(!createdQuiz){
        throw new ApiError(500, "Something went wrong while creating Quiz.")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, createdQuiz, "quiz created successfully")
    )
})

const editQuiz = asyncHandler (async(req, res) => {
       const {id} = req.params;
       const quiz = await Quiz.findById(id);

       if(!quiz){
        throw new ApiError(404, "Quiz not found.")
       }

       const quizCreator = quiz.owner.toString();
       const user = req.user._id.toString()

       if(quizCreator !== user){
        throw new ApiError(403, "Unauthorized access to Edit quiz")
       }

       const quizData = req.body;

       await Quiz.findByIdAndUpdate(id, quizData,{
        runValidators:  true,
        new: true
       })

       return res
       .status(200)
       .json(new ApiResponse(200, quizData, "quiz Updated Successfully."))
})

const getAllQuiz = asyncHandler( async(req, res) =>{
    const owner = req.user._id

    const quizzes = await Quiz.find({owner})

    return res
    .status(200)
    .json(new ApiResponse(200, quizzes, "Quizzes fetched successfully."))
})

const getQuiz = asyncHandler( async(req, res) => {
    const {id} = req.params;

    const quiz = await Quiz.findById(id)

    if(!quiz){
        throw new ApiError(404, "Quiz not found.")
    }

    quiz.impression += 1;
    await quiz.save();

    const questions = await Question.find({quizId: quiz._id})

    return res
    .status(200)
    .json(new ApiResponse(200, {quiz, questions}, "Quiz fetched successfully."))
})

const deleteQuiz = asyncHandler( async(req, res) =>{
    const id = req.params;

    const quiz = await Quiz.findById(id)

    if(!quiz){
        throw new ApiError(404, "Quiz not found.")
    }

    if(quiz.user._id.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized to delete this quiz")
    }

    await Question.deleteMany({quizId: id});

    await Quiz.deleteOne(id);

    return res
    .status(200)
    .json( new ApiResponse(200, {}, "Deleted Successfully."))
})

const shareQuiz = asyncHandler( async(req,res) =>{
    const {id} = req.params;
    
    const quiz = await Quiz.findById(id)
    if(!quiz){
        throw new ApiError(404,"Quiz not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, {sharelink: `/quiz/${quiz._id}`}, "Quiz Shared Successfully."))
})

export { 
    createQuiz,
    editQuiz,
    getAllQuiz,
    getQuiz,
    deleteQuiz,
    shareQuiz
    
}