const dbhandler = require('./dbhandler.js')
const splitAt = index => it =>
  [it.slice(0, index), it.slice(index)]
const fs = require('fs')

module.exports = (req, res) => {
  let articles = dbhandler.get()

  articles.sort((a, b) => {
    return b.views - a.views
  })

  fs.readFile(req.publicFolder + '/main.html', 'UTF-8', (err, data) => {
    if (err) console.log(err)
    let html = splitAt(data.lastIndexOf('articles') + 10)(data)
    let counter = 0
    for (let index in articles) {
      let articleHTML = `<article><h1>${articles[index]['title']}</h1><p>${articles[index]['description']}</p></article>`
      html[0] += articleHTML
      if (counter === 5) {
        break
      }
      counter++
    }
    html = html.join('')
    res.status(200).send(html)
  })
}
