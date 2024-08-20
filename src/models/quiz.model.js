import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        quizType:{
            type: String,
            default: "Q&A",
            enum: ["Q&A", "Poll"]
        },
        date:{
            type: Date,
            default: Date.now()
        },
        impression:{
            type: Number,
            default: 0
        },
        owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }
)

export const Quiz = mongoose.model("Quiz", quizSchema);