const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  hospitalId: {
    type: String,
    required: true
  },
  bloodInventory: {
    'O+': [{
      id: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: 'Pending'
      },
      expiryDate: {
        type: Date,
        required: true,
        default: null
      }
    }],
    'O-': [{
      id: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: 'Pending'
      },
      expiryDate: {
        type: Date,
        required: true,
        default: null
      }
    }],
    'A+': [{
      id: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: 'Pending'
      },
      expiryDate: {
        type: Date,
        required: true,
        default: null
      }
    }],
    'A-': [{
      id: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: 'Pending'
      },
      expiryDate: {
        type: Date,
        required: true,
        default: null
      }
    }],
    'B+': [{
      id: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: 'Pending'
      },
      expiryDate: {
        type: Date,
        required: true,
        default: null
      }
    }],
    'B-': [{
      id: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: 'Pending'
      },
      expiryDate: {
        type: Date,
        required: true,
        default: null
      }
    }],
    'AB+': [{
      id: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: 'Pending'
      },
      expiryDate: {
        type: Date,
        required: true,
        default: null
      }
    }],
    'AB-': [{
      id: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: 'Pending'
      },
      expiryDate: {
        type: Date,
        required: true,
        default: null
      }
    }]
  }
});

const Inventory = mongoose.model('Inventory', hospitalSchema);
module.exports = Inventory;
