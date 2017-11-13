const { ObjectID } = require('mongodb')
const jwt = require('jsonwebtoken')

const { Snippet } = require('./../../models/snippet')
const { User } = require('./../../models/user')

const exampleUserOne = new ObjectID()
const exampleUserTwo = new ObjectID()
const users = [{
  _id: exampleUserOne,
  email: 'example@mail.com',
  password: 'examPass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: exampleUserOne, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: exampleUserTwo,
  email: 'example2@othermail.com',
  password: 'examPass2',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: exampleUserTwo, access: 'auth' }, process.env.JWT_SECRET).toString()
  }]
}]

const snippets = [{
  _id: new ObjectID(),
  text: 'test snippet',
  _createdBy: exampleUserOne
}, {
  _id: new ObjectID(),
  text: 'a second test snippet',
  completed: true,
  completedAt: 123456,
  _createdBy: exampleUserTwo
}]

const populateSnippets = (done) => {
  Snippet.remove({}).then(() => {
    return Snippet.insertMany(snippets)
  }).then(() => done())
}

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save()
    var userTwo = new User(users[1]).save()

    return Promise.all([userOne, userTwo]).then()
  }).then(() => done())
}


module.exports = { snippets, populateSnippets, users, populateUsers }
