const mongoose = require('mongoose');


const passengerSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please add a firstName"],
        trim : true
    },
    lastName: {
        type: String,
        required: [true, "Please add a lastName"],
        trim : true
    },
    email : {
        type: String,
        required: [true, "Please add an email"],
        trim: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        trim : true,
    },
    // flights:[{ type: mongoose.Schema.Types.ObjectId, ref:"Flights"}]
    flights:[]


},{collection: "passengers", timestamps: true})

passengerSchema.virtual("flightCount").get(function(){
    return this.flights.length;
})

module.exports = mongoose.model('Passenger', passengerSchema)