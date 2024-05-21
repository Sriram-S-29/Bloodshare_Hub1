const mongoose = require("mongoose");



const CampSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
    uppercase:true
  },
  phno: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    default: " ",
  },
  place: {
    type: String,
    required: true,
  },
  response:{
    Morning:[String],
    Afternoon:[String],
    Evening:[String]
  },
  startTime:{
    type:String,
    required:true,
  },
  endTime:{
    type:String,
    required:true,
  },
  campId:{
    type:Number,
    required:true,
  }
  
});

const Camp =  mongoose.model("camp", CampSchema);

module.exports = Camp;

