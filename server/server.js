require('./config/config')

const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const { ObjectID } = require('mongodb')

var { mongoose } = require('./db/mongoose')
var { Snippet } = require('./models/snippet')
var { User } = require('./models/user')
var { authenticate } = require('./middleware/authenticate')

var app = express()
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
  console.log("patch snippets/:id: the request is: " + req);

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

  console.log("patch snippets/:id: calling mongo...");
  Snippet.findByIdAndUpdate(id, { $set: body }, { new: true }).then((snippet) => {
    if (!snippet) {
      return res.status(400).send()
    }
    console.log("patch snippets/:id: 200, returning with: " + snippet);
    res.send({ snippet })
  }).catch((e) => {
    res.status(400).send()
  })
})

//post User
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var user = new User(body)


  //save saves to the db
  user.save().then(() => {
    return user.generateAuthToken()
  }).then((token) => {
    res.header('x-auth', token).send(user)
  }).catch((e) => {
    res.status(400).send(e)
  })
})


app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user)
})


//post users/login {email, password}
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])

  User.findByCredentials(body.email, body.password).then((user) => {
    user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user)
    })
  }).catch((e) => {
    res.status(400).send()
  })
})

//private delete token route
app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }, () => {
    res.status(400).send()
  })
})


app.listen(port, () => {
  console.log(`running at port ${port}`)
})


module.exports = { app }
