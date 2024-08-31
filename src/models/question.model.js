import mongoose, { Schema } from "mongoose";

const  questionSchema = new Schema(
    {
        quizID:{
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
        options: [{
            text: { 
                type: String, 
            },
            imageUrl: { 
                type: String,     
            }, 
            isCorrect: {
                type: Boolean, 
                required: true
            }
        }],
        timer: {
            type: String
        }

    },{timestamps: true}
)


export const Question = mongoose.model("Question", questionSchema );