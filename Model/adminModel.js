const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    H_name: {
        type: String,
        required: true
    },
    appointment: {
        type: [{
            id: {
                type: String,
                required: true
            },
            date: {
                type: String,
                required: true
            },
            name:{
                type: String,
                required: true
            },
            bloodGroup:{
                type: String,
                required: true
            },
            status: {
                type: String,
                default: "Pending"
            }
        }],
        default: []
    },
    Place:{
        type:String,
        default:null
    }
});

const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;
