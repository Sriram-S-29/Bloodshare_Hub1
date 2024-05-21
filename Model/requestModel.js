const mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema({
    H_name:{
        type:String,
        require:true,
        uppercase:true
    },
    H_address:{
        type:String,
        require:true,
        uppercase:true
    },
    H_district:{
        type:String,
        require:true,
        uppercase:true
    },
    P_id:{
        type:String,
        require:true,
        uppercase:true
    },
    phno:
    {
        type:Number,
        require:true,
    },
    date_need:
    {
        type:String,
        require:true
    },
    blood_group:
    {
        type:String,
        require:true
    },
    purpose:{
        type:String,
        default:"Emergency"
    },
    response_id:
    {
        type:String,
        default:""
    },
});

const Request =  mongoose.model("request", RequestSchema);

module.exports = Request;

