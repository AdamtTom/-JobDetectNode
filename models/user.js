const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  predictions: {
    type: [{
      text: String,
      fake: Boolean,
      proba: Number
    }],
    default: []
  }
}, {timestamps: true})

module.exports = mongoose.model('users', userSchema)




