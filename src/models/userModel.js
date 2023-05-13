const mongoose = require('mongoose');


// const addressSchema = new mongoose.Schema({
//     street: String,
//     city: String
// })


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please add a username"],
        trim : true,
        validate : {
            validator : username => username.length > 2,
            message: "Username must be at least 2 characters"
        }
    },
    email : {
        type: String,
        required: [true, "Please add an email"],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please add a password"]
    },
    userRole: {
        type: String,
        enum: {
            values: ['staffUser', 'clientUser'],
            message: '{VALUE} is not supported'
          },
        default:"clientUser"
    },
    // address: addressSchema

},{collection: "users", timestamps: true})


//? instance bazında çalışır. this: user instance
// userSchema.methods.sayHi = function(){
//     console.log(`Hi. My name is ${this.name}`);
// }
// const user = await User.findOne({email})
// user.sayHi()

//? schema bazında çalışır. this : userSchema
// userSchema.statics.findByName = function(name) {
//     return this.where({name: new RegExp(name, "i")})
// }
// const user = await User.findByName("viCtoR")
// const user = await User.find().findByName("viCtoR") not valid. it doesnt work in query

//? schema bazında sadece querylerde çalışır
// userSchema.query.byName = function(name) {
//     return this.where({name: new RegExp(name, "i")})
// }
// const user = await User.find().byName("viCtoR")
// const user = await User.byName("viCtoR") this is not valid. it is for query

//? instance bazında db ye data eklemeden field gibi instance a veri ekleme ve çekme (get & set)
// userSchema.virtual("namedEmail").get(function(){
//     return `${this.name} <${this.email}>`
// })
// const user = await User.findOne({name: "victor"})
// console.log(user.namedEmail); // "victor <vic@test.com>"

// ?if there is a reservations field in user model like this: [{ type: mongoose.Schema.Types.ObjectId, ref:"Reservation"}]
//? we could make a pre middleware function:
//* remove
// userSchema.pre("remove", function(next){
//     const Reservation =  mongoose.model('Reservation')
//     Reservation.remove({ _id: { $in: this.reservations}}).then(() => next())
// })

//* pre
// userSchema.pre("save", function(next){
//     this.updatedAt = Date.now() // böyle bir field yok bizim schemada
// })

//* post
// userSchema.post("save", function(doc, next){
//     doc.sayHi()
//     next();
// })



module.exports = mongoose.model('User', userSchema)