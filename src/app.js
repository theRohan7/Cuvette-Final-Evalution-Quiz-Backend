import express from "express";
import cors from "cors";

const app  = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))

//Routes
import userRouter from "./routes/user.routes.js"
import quizRouter from "./routes/quiz.routes.js"
import questionRouter from "./routes/question.route.js"

//Routes declaration

app.get("/", (req, res) => {
    res.send("hello world")
})

app.use("/user", userRouter)
app.use("/quiz", quizRouter)
app.use("/quiz", questionRouter)





export { app }