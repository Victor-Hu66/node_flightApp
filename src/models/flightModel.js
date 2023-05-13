const mongoose = require('mongoose');

const flightSchema = mongoose.Schema({
    flightNumber: {
        type : String,
        required : true,
        trim : true
    },
    operatingAirlines: {
        type : String,
        required : true,
        trim : true
    },
    departureCity: {
        type : String,
        required : true,
        trim : true
    },
    arrivalCity: {
        type : String,
        required : true,
        trim : true
    },

    dateofDeparture: {
        type : Date,
        required : true,
        trim : true
    }
},{collection: "flights", timestamps: true})

module.exports = mongoose.model("Flights", flightSchema)