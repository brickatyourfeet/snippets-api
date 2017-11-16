const mongoose = require('mongoose')
const { Comment } = require('./comment')

//var Comment = new mongoose.Schema({ commentBody: String })


let Snippet = mongoose.model('Snippet', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  code: {
    type: String,
    required: true
    //minlength: 1,
    //trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  comments: [Comment],
  completedAt: {
    type: Number,
    default: null
  },
  _createdBy: {
    type: mongoose.Schema.Types.ObjectId
  }
})

module.exports = { Snippet }
