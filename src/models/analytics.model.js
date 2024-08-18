import mongoose, { Schema } from "mongoose";


const analyticSchema = new Schema(
    {
      quizId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Quiz"
      },

      questionId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Question"
      },

      totalImpression:{
        type:Number,
      },

      totalAttempted:{
        type:Number,
      },

      totalCorrect:{
        type:Number
      },

      totalIncorrect:{
        type:Number
      },

    }
)

export const Analytics = mongoose.model("Analytics", analyticSchema)