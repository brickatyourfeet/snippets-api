const mongoose = require('mongoose')


var Comment = new mongoose.Schema({
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

//var Comment = mongoose.model('Comment', CommentSchema)

module.exports = { Comment }
