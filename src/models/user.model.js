import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: [true, 'password is required']
        },
    },
    {
        timestamps: true
    }
)

// Encrypt password before saving to database

userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// check the encrypted password with user given password

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(

        {
            _id : this._id,
            email: this.email,
            password: this.password
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)