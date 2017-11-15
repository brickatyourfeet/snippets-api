const mongoose = require('mongoose')


let Comment = mongoose.model('Comment', {
  commentBody: {
    type: String,
    // required: true,
    minlength: 1,
    trim: true
  }
  //,
  // commentDate: {
  //   type: Date,
  //   default: Date.now
  // },
  // commentUser: {
  //   type: Schema.types.ObjectId,
  //   ref: 'users'
  // }


})

module.exports = { Comment }
