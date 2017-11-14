const mongoose = require('mongoose')

let Snippet = mongoose.model('Snippet', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  code: {
    type: String,
    // required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  comments: [{
    text: String
  }],
  completedAt: {
    type: Number,
    default: null
  },
  _createdBy: {
    type: mongoose.Schema.Types.ObjectId
  }
})

module.exports = { Snippet }
