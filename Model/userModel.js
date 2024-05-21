const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phno: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        default: null,
        set: (value) => value.toUpperCase()
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: null
    },
    district: {
        type: String,
        default: null,
        set: (value) => value.toUpperCase()
    },
    donatedTimes: {
        type: Number,
        default: 0
    },
    last_donate:{
        type:String,
        default:null
    },
    weight:{
        type:Number,
        default:0
    },
    status:{
        type:Number,
        default:1
    },
    last_edit:{
        type:Date,
        default:Date.now
    },
    image :{
        type : String,
        require : true   
    },
})





const User = mongoose.model('login', userSchema)
module.exports = User