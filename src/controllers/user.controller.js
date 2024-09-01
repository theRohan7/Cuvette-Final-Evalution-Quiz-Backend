import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const generateToken = async (userId) => {
   try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()

    return accessToken
    
   } catch (error) {
     throw new ApiError(500, "Something went wrong while generating token.")
   }
}



const registerUser = asyncHandler( async(req, res) => {
    
    const {name, email, password} = req.body

    if(name === ""){
        throw new ApiError(400, "Name is Required")
    }
    if(email === ""){
        throw new ApiError(400, "Email is Required")
    }
    if(password === ""){
        throw new ApiError(400, "Name is Required")
    }

    const existedUser = await User.findOne({email})

    if(existedUser){
        throw new ApiError(409, 'User with Email already exists.')
    }

    const user = await User.create({
        name, 
        email, 
        password,
    })

    const createduser = await User.findById(user._id).select("-password")

    if(!createduser){
        throw new ApiError(500, "Something went wrong while Registering.")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(200, createduser, 'User registered successfully.')
    )
})

const loginUser = asyncHandler( async(req, res) => {
   // STEPS

    // 1. get input from req body
    const {email, password} = req.body

    // 2. check if there's username or email is there

    if(!email){
        throw new ApiError(400, "Email, password is required.")
    }
    // 3. find user from DB

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User does not exists.")
    }
    // 4. check password

    const checkPassword = await user.isPasswordCorrect(password)

    if(!checkPassword){
        throw new ApiError(500, "Invalid User Credentials")
    }
    // 5. generate access token for the user
    const accessToken = await generateToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken
            },
            "User Logged in successfully."
        )
    )
} )

const logoutUser = asyncHandler ( async(req, res) => {
    const user = await User.findById(req.user._id)

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
    .status(200)
    .json( new ApiResponse(200, {}, "User logged out"))
})


export { registerUser, loginUser, logoutUser }