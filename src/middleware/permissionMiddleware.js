const asyncHandler = require("express-async-handler"); // for do not using try catch
const jwt = require("jsonwebtoken")
const User = require("../models/userModel")


const isStaffUser = asyncHandler (async (req, res, next) => {
    if (req.user.userRole === 'staffUser') {
        next();
    } else {
        res.status(401)
        throw new Error("You are not allowed to perform this action!")
    }
})


const setUser = asyncHandler( async (req, res, next) => {
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
            req.user = null
            next()
        }
    } else {
        req.user = null
        next()
    }
})


module.exports = {
    isStaffUser,
    setUser
}