const dbhandler = require('./dbhandler.js')
const splitAt = index => it =>
  [it.slice(0, index), it.slice(index)]
const fs = require('fs')

module.exports = (req, res) => {
  let articles = dbhandler.get()

  fs.readFile(req.publicFolder + '/all.html', 'UTF-8', (err, data) => {
    if (err) console.log(err)
    let html = splitAt(data.lastIndexOf('listTarget') + 12)(data)
    for (let article in articles) {
      if (!articles[article]['deleted']) {
        let articleHTML = `<tr onclick="window.document.location='/details/${article}';" ><td>${articles[article]['title']}</td><td>${articles[article]['date']}</td></tr>`
        html[0] += articleHTML
      }
    }
    html = html.join('')
    res.status(200).send(html)
  })
}
