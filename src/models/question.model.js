import mongoose, { Schema } from "mongoose";

const  questionSchema = new Schema(
    {
        quizId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz"
        },
        questionText:{
            type: String,
            required: true
        },
        optionType:{
            type: String,
            enum: ["Text", "Image", "Text & Image"],
            default: "Text",
            required: true,
        },
        option: [{
            text: {type: String, required: true},
            isCorrect: {type: Boolean, required: true}
        }],
        timer:{
            type: Number,
            eum: [0, 5, 10],
            required: true,
            default: 0
        }

    },{timestamps: true}
)


export const Question = mongoose.model("Question", questionSchema );