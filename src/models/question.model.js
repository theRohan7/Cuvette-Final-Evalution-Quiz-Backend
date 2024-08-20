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
        time:{
            type: Number,
            eum: [0, 5, 10],
            required: true,
            default: 0
        }

    },{timestamps: true}
)

const optionSchema = new Schema(
    {
        questionID:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Quiz"
        },
        optionText:{
            type: String,
            required: true
        },
        is_correct:{
            type: Boolean,
            required: true
        }
       
    },{timestamps: true}
)

export const Question = mongoose.model("Question", questionSchema );
export const Option = mongoose.model("Option", optionSchema );


/*  


Option
- id: UUID (primary key)
- question_id: UUID (foreign key to Question)
- text: Text
- is_correct: Boolean
- order: Integer
- created_at: Timestamp
- updated_at: Timestamp
 
*/