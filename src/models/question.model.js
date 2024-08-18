import mongoose, { Schema } from "mongoose";

const  questionSchema = new Schema(
    {
        quizId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz"
        },
        question:{
            type: String,
            required: true
        },
        optionType:{
            type: String,
            enum: ["Text", "Image", "Text & Image"],
            default: "Text",
            required: true,
        },
        time:{
            type: Number,
            eum: [0, 5, 10],
            required: true,
            default: 0
        }

    }
)

const optionSchema = new Schema(
    {
        questionID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz"
        },
        options:{
            type: Array,
            required: true
        },
        correctOption:{
            type: String,
            required: true
        }
    }
)

export const Question = mongoose.model("Question", questionSchema );
export const Option = mongoose.model("Option", optionSchema );