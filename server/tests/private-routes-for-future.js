// app.patch('/snippets/:id', authenticate, (req, res) => {
//   console.log("patch snippets/:id: the request is: " + req);
//
//   let id = req.params.id
//   //using lodash pick to only let valid props be updated
//   let body = _.pick(req.body, ['text', 'completed'])
//
//   if (!ObjectID.isValid(id)) {
//     return res.status(404).send()
//   }
//
//   if (_.isBoolean(body.completed) && body.completed) {
//     body.completedAt = new Date().getTime()
//   } else {
//     body.completed = false
//     body.completedAt = null
//   }
//
//   console.log("patch snippets/:id: calling mongo...");
//   Snippet.findOneAndUpdate({ _id: id, _createdBy: req.user._id }, { $set: body }, { new: true }).then((snippet) => {
//     if (!snippet) {
//       return res.status(400).send()
//     }
//     console.log("patch snippets/:id: 200, returning with: " + snippet);
//     res.send({ snippet })
//   }).catch((e) => {
//     res.status(400).send()
//   })
// })
