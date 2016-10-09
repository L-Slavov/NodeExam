const dbhandler = require('./dbhandler.js')
const splitAt = index => it =>
  [it.slice(0, index), it.slice(index)]
const fs = require('fs')

module.exports = (req, res) => {
  let articles = dbhandler.get()
  fs.readFile(req.publicFolder + '/details.html', 'UTF-8', (err, data) => {
    if (err) console.log(err)
    let html = splitAt(data.lastIndexOf('body') + 6)(data)
    let articleHTML = `<article><h1>${articles[req.params.id]['title']}</h1><p>${articles[req.params.id]['description']}</p><p>${articles[req.params.id]['date']}</p><p>Views: ${articles[req.params.id]['views']}</p></article>`
    if (articles[req.params.id]['image']) {
      articleHTML += `<image src="${articles[req.params.id]['image']}"/>`
    }
    if (articles[req.params.id]['deleted']) {
      articleHTML += `<form enctype="multipart/form-data" method="POST"> <input type="hidden" name="status" value = "false"><button type="submit">Undelete</button></form>`
    } else {
      articleHTML += `<form enctype="multipart/form-data" method="POST"> <input type="hidden" name="status" value = "true"><button type="submit">Delete</button></form>`
    }

    for (let comment in articles[req.params.id]['comments']) {
      articleHTML += `<ul>`
      articleHTML += `<li>Date: ${articles[req.params.id]['comments'][comment]['date']} | User: ${articles[req.params.id]['comments'][comment]['username']}  | Comment: ${articles[req.params.id]['comments'][comment]['message']}</li>`
      articleHTML += `</ul>`
    }

    articleHTML += `<form enctype="multipart/form-data" method="POST" action = "/details/${req.params.id}/comment">`
    articleHTML += `Username: <input type="text" name="username">`
    articleHTML += `Comment: <textarea name="message"></textarea>`
    articleHTML += `<button type="submit"> Submit </button> </form>`

    html[0] += articleHTML
    html = html.join('')

    articles[req.params.id]['views'] = articles[req.params.id]['views'] + 1
    dbhandler.update(req.params.id, articles[req.params.id])
    res.status(200).send(html)
  })
}
