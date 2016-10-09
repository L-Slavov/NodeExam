
module.exports = {
  'get': get,
  'insert': insert,
  'update': update
}

const fs = require('fs')
const path = require('path')
const db = require('./database.json')

function get () {
  return db.articles
}

function insert (article, callback) {
  article['deleted'] = false
  article['comments'] = []
  article['views'] = 0
  article['date'] = new Date().toString()
  db.articles.push(article)
  save(db, callback)
}

function update (index, article, callback) {
  db.articles[index] = article
  save(db, callback)
}

function save (db, callback) {
  let error = false
  fs.writeFile(path.join(__dirname, '/database.json'), JSON.stringify(db), {encoding: 'UTF-8'}, (err) => {
    if (err) error = new Error('Unable to write in database')
    if (callback) callback(error)
  })
}
