import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Question } from "../models/question.model.js";
import { Quiz } from "../models/quiz.model.js";
import { QuizAnalysis } from "../models/analytics.model.js";
import { uploadOnCloudinary } from "../utils/fileUploader.js";



const addQuestion = asyncHandler( async(req, res) =>{
    
    const {quizID} = req.params
    const {questionData} = req.body
    
    
    const quiz = await Quiz.findById(quizID)

    if(!quiz){
        throw new ApiError(404, "Quiz not found")
    }

    if(quiz.owner.toString() !== req.user._id.toString()){
        throw new ApiError(403, "not authorized to add-question")
    }

    const savedQuestions = await Promise.all(questionData.map(async (que) =>{

        const options = Promise.all(que.options.map( async(option) => {
            let imageUrl = option.imageUrl;
            if(que.optionType === "Image" || que.optionType === "Text & Image"){
                if(!imageUrl){
                    throw new ApiError(400, "Image Url is required for the selected option")
                }

                const result = await uploadOnCloudinary(imageUrl)
                imageUrl = result.url;
            };

            return {
                text: option.text,
                imageUrl: que.optionType !== "Text" ? imageUrl : undefined,
                isCorrect: option.isCorrect,
            };
        }));

        const newQuestion = new Question({
            quizID: quizID,
            questionText: que.questionText,
            optionType: que.optionType,
            options: options,
            timer: que.timer
        });
        return await newQuestion.save();
    }));

    quiz.questions.push(...savedQuestions.map(q => q._id));
    await quiz.save();

    //Initializing Quiz Analysis
    const quizAnalysis = new QuizAnalysis({
        quizID: quizID,
        impressions: 0,
        questionAnalysis: savedQuestions.map(que => ({
            questionID: que._id,
            totalAttempt: 0,
            toatlCorrect: 0,
            totalIncorrect: 0,
            optionCounts: que.options.map(option => ({
                optionText: option.text,
                count: 0
            }))
        }))
    })

    await quizAnalysis.save();


    return res
    .status(200)
    .json( new ApiResponse(200, savedQuestions, "Question created successfully."))
   
})

export { 
    addQuestion,
 }