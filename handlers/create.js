const dbhandler = require('./dbhandler.js')
const fs = require('fs')

module.exports = {
  get: get,
  post: post
}

function get (req, res) {
  res.sendFile(req.publicFolder + '/create.html')
}

function post (req, res) {
  let temp = {}
  if (Object.keys(req.files).length !== 0) {
    let MimeType = req.files.photo[0].originalFilename.split('.')[1]
    let location = nameGenerator(req.publicFolder, MimeType)
    let read = fs.createReadStream(req.files.photo[0].path)
    let write = fs.createWriteStream(location.full)

    read.pipe(write)
    temp['image'] = location.partial
  } else {
    temp['image'] = false
  }

  if (req.body.title === '' || req.body.description === '') {
    res.status(400).end('Please fill the form fields only the image is optional')
    return
  } else {
    temp['title'] = req.body.title
    temp['description'] = req.body.description
  }

  dbhandler.insert(temp, (err) => {
    if (err) {
      throw err
    } else {
      res.status(200).end('Article added succesfully')
    }
  })
}

function nameGenerator (publicFolder, MimeType) {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let location = {}

  for (let i = 0; i < 11; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }

  location['full'] = publicFolder + 'images/' + text + '.' + MimeType
  location['partial'] = '/images/' + text + '.' + MimeType
  try {
    fs.accessSync(location.full, 'fs.constants.F_OK')
  } catch (err) {
    return location
  }
  nameGenerator(publicFolder, MimeType)
}

