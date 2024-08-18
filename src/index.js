import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.on('error', (error)=> {
        console.log("ERROR: ", error);
        throw error
    })
})
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`server running at port: ${process.env.PORT}`);
        
    })
})
.catch((err) =>{
    console.log(`MongoDB Connection Failed!!`, err);
    
})