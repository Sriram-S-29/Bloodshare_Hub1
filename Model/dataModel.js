const mongoose = require("mongoose");



const DataSchema = new mongoose.Schema({
    email: {
        type: String,
        default:"admin1@gmail.com"
    },
    Jan: {
        count: {
            type: Number,
            default: 0
        }
    },
    Feb: {
        count: {
            type: Number,
            default: 0
        }
    },
    Mar: {
        count: {
            type: Number,
            default: 0
        }
    },
    Apr: {
        count: {
            type: Number,
            default: 0
        }
    },
    May: {
        count: {
            type: Number,
            default: 0
        }
    },
    Jun: {
        count: {
            type: Number,
            default: 0
        }
    },
    Jul: {
        count: {
            type: Number,
            default: 0
        }
    },
    Aug: {
        count: {
            type: Number,
            default: 0
        }
    },
    Sep: {
        count: {
            type: Number,
            default: 0
        }
    },
    Oct: {
        count: {
            type: Number,
            default: 0
        }
    },
    Nov: {
        count: {
            type: Number,
            default: 0
        }
    },
    Dec: {
        count: {
            type: Number,
            default: 0
        }
    },
    BloodStats:{
        'A+':{
            count:{
                type:Number,
                default:0
            }
        },
        'A-':{
            count:{
                type:Number,
                default:0
            }
        },
        'AB+':{
            count:{
                type:Number,
                default:0
            }
        },
        'AB-':{
            count:{
                type:Number,
                default:0
            }
        },
        'O+':{
            count:{
                type:Number,
                default:0
            }
        },
        'O-':{
            count:{
                type:Number,
                default:0
            }
        },
        'B+':{
            count:{
                type:Number,
                default:0
            }
        },
        'B-':{
            count:{
                type:Number,
                default:0
            }
        },
    }
});
const Data = mongoose.model("data", DataSchema);

module.exports = Data;