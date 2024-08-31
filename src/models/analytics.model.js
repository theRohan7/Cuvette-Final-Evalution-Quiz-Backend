import mongoose, { Schema } from "mongoose";


const QuizAnalysisSchema = new Schema(
  {
    quizID: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Quiz' 
    },
    impressions: {
      type: Number
    },
    questionAnalysis: [
      {
        questionID: { 
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'Question' 
        },
        totalAttempt: {
          type: Number,
          default: 0
        },
        totalCorrect: {
          type: Number,
          default: 0
        },
        totalIncorrect:{ 
          type: Number,
          default: 0
        },
        optionCounts: [
          {
            optionText: String,
            count: Number
          }
        ]
      }
    ]
});


export const QuizAnalysis = mongoose.model("QuizAnalysis", QuizAnalysisSchema)





