const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')

let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
})

UserSchema.methods.toJSON = function() {
  let user = this
  let userObject = user.toObject()

  return _.pick(userObject, ['_id', 'email'])
}

//using function keyword because I need the this keyword
UserSchema.methods.generateAuthToken = function() {
  let user = this
  let access = 'auth'
  let token = jwt.sign({ _id: user._id.toHexString(), access }, 'secretvalue').toString()

  user.tokens.push({ access, token })

  //save returns a promise!  so returning it this way returns a value instead
  return user.save().then(() => {
    return token
  })
}

UserSchema.statics.findByToken = function(token) {
  let User = this
  let decoded

  try {
    decoded = jwt.verify(token, 'secretvalue')
  } catch (e) {

  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  })

}

let User = mongoose.model('User', UserSchema)


module.exports = { User }
