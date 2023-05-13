const User = require("../models/userModel")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator")
const asyncHandler = require("express-async-handler"); // for do not using try catch

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser =asyncHandler( async (req, res) => {
    const {username, email, password} = req.body

    if(!username || !email || !password){
        res.status(400)
        throw new Error("Please add all required fields")
    }

    // Check if the user exists
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400)
        throw new Error("User already exists")
    }

    // email and password validation
    if(!validator.isEmail(email)){
        throw Error("Email is not valid")
    }
    if(!validator.isStrongPassword(password)){
        throw Error("Password is not strong enough")
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create a new user
    const user = await User.create({
        username,
        email,
        password : hashedPassword
    })

    if(user){
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else {
        res.status(400)
        throw new Error("Invalid user data")
    }

})

// @desc    Authanticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    // check for the user email and password
    const user = await User.findOne({email})
    if(user && (await bcrypt.compare(password, user.password))){
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: generateToken(user._id)
        })
    } else{
        res.status(400)
        throw new Error("Invalid credantials")
    }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
   
    res.status(200).json(req.user);
  });


// Generate JWT
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"})
}


module.exports = {
    registerUser,
    loginUser,
    getMe
}