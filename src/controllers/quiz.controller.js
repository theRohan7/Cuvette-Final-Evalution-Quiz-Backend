import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Quiz } from "../models/quiz.model.js"
import { Question } from "../models/question.model.js";
import { QuizAnalysis } from "../models/analytics.model.js";



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

    const quiz = await Quiz.findById(id).populate('questions')

    if(!quiz){
        throw new ApiError(404, "Quiz not found.")
    }

    quiz.impression += 1;
    await quiz.save();

    return res
    .status(200)
    .json(new ApiResponse(200, {quiz}, "Quiz fetched successfully."))
})

const deleteQuiz = asyncHandler( async(req, res) =>{
    const {id} = req.params;
    
    const quiz = await Quiz.findById(id)

    if(!quiz){
        throw new ApiError(404, "Quiz not found.")
    }

    if(quiz.owner._id.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized to delete this quiz")
    }

    await Promise.all(quiz.questions.map((question) => Question.findByIdAndDelete(question)));


    await Quiz.findByIdAndDelete(id);

    return res
    .status(200)
    .json( new ApiResponse(200, {}, "Deleted Successfully."))
})

const attemptQuiz = asyncHandler ( async(req, res) => {
      const {id} = req.params;
      const { answers } = req.body;
      
         
      const quiz = await Quiz.findById(id).populate("questions")

      if(!quiz){
        throw new ApiError(404, 'QUiz not found')
      }

      const quizAnalysis = await QuizAnalysis.findOne({quizID: quiz._id})

      if(!quizAnalysis){
        throw new ApiError(404, 'QUiz-analysis not found')
      } 

      quizAnalysis.impressions += 1;

      const results = await Promise.all(answers.map(async(ans) => {
        const {questionID, selectedOption, timeTaken} = ans;
        const question = quiz.questions.find(que => que._id.toString() === questionID )

        if(!question){
          throw new ApiError (404, "Questions not found")
        }
        
        if(timeTaken > question.timer) {
          return { questionID, error: "Time limit excedded"}
        }

        const questionAnalysis = quizAnalysis.questionAnalysis.find(qa => qa.questionID.toString() === questionID );
        questionAnalysis.totalAttempt += 1;

        let isCorrect = false;
        if(quiz.quizType === 'Q&A') {
          isCorrect = question.options.some(option => {
            return option.isCorrect && option.text.trim().toLowerCase() === selectedOption.trim().toLowerCase();
          });

          if(isCorrect){
            questionAnalysis.totalCorrect += 1;
          } else {
            questionAnalysis.totalIncorrect += 1;
          }
        } else if (quiz.quizType === "Poll") {
          const optionCount = questionAnalysis.optionCounts.find(oc => oc.optionText === selectedOption)

          if(optionCount){
            optionCount.count += 1;
          }
        }

        return {questionID, correct: quiz.quizType === "Q&A" ? isCorrect : undefined }

      }));

      await quizAnalysis.save();

   

      return res
      .status(200)
      .json( new ApiResponse(200, {results}, 'Thank you for completing quiz.'));

      
})

const quizAnalysis = asyncHandler ( async(req, res) => {
    const {quizID} = req.params;

    const analysis = await QuizAnalysis.findOne({quizID}).populate('questionAnalysis.questionID')
    const quiz = await Quiz.findById(quizID)
    const createdOn = quiz.createdAt
    const quizName = quiz.name
    const quizType = quiz.quizType

  

    
    return res
    .status(200)
    .json( new ApiResponse(200, {analysis,createdOn, quizName, quizType}, "Information fetched"))

})

   
    
export { 
    createQuiz,
    editQuiz,
    getAllQuiz,
    getQuiz,
    deleteQuiz,
    attemptQuiz,
    quizAnalysis
    
}