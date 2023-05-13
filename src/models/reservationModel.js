const mongoose = require('mongoose');
const User = require("./userModel")
const Flight = require("./flightModel")


const reservationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: User 
    },
    flight: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: Flight 
    },
    passengers: [],

},{collection: "reservations", timestamps: true})

module.exports = mongoose.model('Reservation', reservationSchema)

