const mongoose = require("mongoose")


const appointschema = new mongoose.Schema({
    id:{
        type:String,
        required : true
    },
    date:{
        type:String,
        required : true
    },
    status:{
        type:String,
        default:"Pending"
    },
    hosp_n:{
        type:String,
        required : true
    }
})

const Appoint = mongoose.model("appointment",appointschema)
module.exports = Appoint