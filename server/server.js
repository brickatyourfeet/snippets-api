require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

const { mongoose } = require('./db/mongoose')
const { Snippet } = require('./models/snippet')
const { User } = require('./models/user')

const app = express()
const port = process.env.PORT

app.use(require('cors')())
app.disable('x-powered-by')
app.use(bodyParser.json())

app.post('/snippets', (req, res) => {
  let snippet = new Snippet({
    text: req.body.text
  })

  snippet.save().then((doc) => {
    res.send(doc)
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/snippets', (req, res) => {
  Snippet.find().then((snippets) => {
    res.send({ snippets })
  }, (e) => {
    res.status(400).send(e)
  })
})

app.get('/snippets/:id', (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Snippet.findById(id).then((snippet) => {
    if (!snippet) {
      return res.status(404).send()
    }
    res.send({ snippet })
  }).catch((e) => {
    res.status(400).send()
  })
})

app.delete('/snippets/:id', (req, res) => {
  let id = req.params.id

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  Snippet.findByIdAndRemove(id).then((snippet) => {
    if (!snippet) {
      return res.status(404).send()
    }

    res.send({ snippet })
  }).catch((e) => {
    res.status(400).send()
  })
})

app.patch('/snippets/:id', (req, res) => {
  let id = req.params.id
  //using lodash pick to only let valid props be updated
  let body = _.pick(req.body, ['text', 'completed'])

  if (!ObjectID.isValid(id)) {
    return res.status(404).send()
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime()
  } else {
    body.completed = false
    body.completedAt = null
  }

  Snippet.findByIdAndUpdate(id, { $set: body }, { new: true }).then((snippet) => {
    if (!snippet) {
      return res.status(400).send()
    }

    res.send({ snippet })
  }).catch((e) => {
    res.status(400).send()
  })
})

//post User
app.post('/users', (req, res) => {
  let body = _.pick(req.body, ['email', 'password'])
  let user = new User(body)


  //save saves to the db
  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e)
  })
})

app.get('users/me', (req, res) => {
  let token = req.header('x-auth')

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject()
    }

    res.send(user)
  }).catch((e) => {
    res.status(401).send()
  })
})

app.listen(port, () => {
  console.log(`running at port ${port}`)
})


module.exports = { app }
