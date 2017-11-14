const mongoose = require('mongoose')


let Comment = mongoose.model('Comment', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
  // ,
  // snippet_id: {
  //   type: String,
  //   required: true
  // }

})

module.exports = { Comment }
