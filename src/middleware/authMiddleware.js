const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler"); // for do not using try catch

const protect = asyncHandler(async (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            // Get token from header
            const token = req.headers.authorization.split(" ")[1]
            
            // Verify authorization token
            const decoded = await jwt.verify(token, process.env.JWT_SECRET)

            // Get user from token 
            req.user = await User.findById(decoded.id)

            next();
        } catch (error) {
            res.status(401)
            throw new Error("Not authorized!")
        }
    } else {
        res.status(401)
        throw new Error("No token available!")
    }
})

module.exports = protect