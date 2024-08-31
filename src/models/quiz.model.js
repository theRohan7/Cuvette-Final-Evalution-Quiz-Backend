import mongoose, { Schema } from "mongoose";

const quizSchema = new Schema(
    {
        name:{
            type: String,
            required: true,
        },
        quizType:{
            type: String,
            enum: ["Q&A", "Poll"],
            required: true
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
            ref: "User",
            required: true
        },
        questions: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Question"
        }]
    },
    {timestamps: true}
)

export const Quiz = mongoose.model("Quiz", quizSchema);