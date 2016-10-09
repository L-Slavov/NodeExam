const dbhandler = require('./dbhandler.js')

module.exports = (req, res) => {
  if (req.body.username === '' || req.body.message === '') {
    res.status(400).send('Please fill both username and comment input')
  } else {
    let article = dbhandler.get()[req.params.id]
    let date = new Date().toString()

    article['comments'].push({'username': req.body.username, 'message': req.body.message, 'date': date})
    dbhandler.update(req.params.id, article, (err) => {
      if (err) {
        res.status(500).send('Oops something broke')
      } else {
        res.status(200).send('Comment added')
      }
    })
  }
}
