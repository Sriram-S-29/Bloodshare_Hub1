const mongoose = require('mongoose')
mongoose.set('strictQuery', true);
module.exports = function mongoConnect ()
{
    mongoose.connect("mongodb://localhost:27017/BloodShare_Hub").then(() => {
    console.log("Database Connected")
}).catch(() => {
    console.log("ERROR")
})
}