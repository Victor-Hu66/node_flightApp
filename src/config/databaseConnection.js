const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
    useNewUrlParser : true,
    useUnifiedTopology : true
})
.then( () => {
    console.log("connected db successfully..");
}
).catch( (error) => {
    console.log("db connection failed.. " + error);
});