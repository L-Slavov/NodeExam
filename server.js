const express = require('express')
const path = require('path')
const multiparty = require('multiparty')
let app = express()

let publicFolder = path.join(__dirname, '/public/')

let router = require('./handlers/router.js')(express)

app.use(express.static(publicFolder))

app.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body = {}
    req.files = {}
    let form = new multiparty.Form()
    form.parse(req, (err, fields, files) => {
      if (err) console.log(err)
      for (let item in fields) {
        req.body[item] = fields[item][0].trim()
      }

      for (let file in files) {
        if (files[file][0]['originalFilename'] !== '') {
          req.files[file] = files[file]
        }
      }

      next()
    })
  } else {
    next()
  }
})

app.use((req, res, next) => {
  req.publicFolder = publicFolder
  next()
})

app.use('/', router)

app.listen(8000, () => {
  console.log('Server is listening to port 8000')
})
