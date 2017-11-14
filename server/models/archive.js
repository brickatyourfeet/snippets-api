const mongoose = require('mongoose')

let Archive = mongoose.model('Archive', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  },
  _createdBy: {
    type: mongoose.Schema.Types.ObjectId
  },
  solvedBy: {
    type: String
  }
})

module.exports = { Archive }
