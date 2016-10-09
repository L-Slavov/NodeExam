const dbhandler = require('./dbhandler.js')

module.exports = (req, res) => {
  let articles = dbhandler.get()
  let article = articles[req.params.id]

  article['deleted'] = (req.body.status === 'true' ? true : false)
  dbhandler.update(req.params.id, article)
  res.status(200).send('Article status updated')
}
