const dbhandler = require('./dbhandler.js')
const splitAt = index => it =>
  [it.slice(0, index), it.slice(index)]
const fs = require('fs')

module.exports = (req, res) => {
  if (req.headers['my-authorization'] !== 'admin') {
    res.status(404).send('You are not Authorized to view this page')
    return
  }

  let articles = dbhandler.get()
  let totalViews = 0
  let totalComments = 0

  for (let article in articles) {
    totalViews += articles[article]['views']
    totalComments += articles[article]['comments'].length
  }

  fs.readFile(req.publicFolder + '/details.html', 'UTF-8', (err, data) => {
    if (err) console.log(err)
    let html = splitAt(data.lastIndexOf('<body>') + 6)(data)
    html[0] += `<b> Total Views: ${totalViews} | Total comments: ${totalComments}</b>`
    for (let article in articles) {
      html[0] += `<article><h1>${articles[article]['title']}</h1><p>${articles[article]['description']}</p></article>`
    }
    html = html.join('')
    res.status(200).send(html)
  })
}
