const index = require('./index.js')
const create = require('./create.js')
const all = require('./all.js')
const details = require('./details.js')
const articleStatus = require('./articleStatus.js')
const comments = require('./comments.js')
const statistics = require('./statistics.js')


module.exports = (express) => {
  let router = express.Router()

  router.get('/', index)
  router.get('/create', create.get)
  router.post('/create', create.post)
  router.get('/all', all)
  router.get('/details/:id', details)
  router.post('/details/:id/comment', comments)
  router.post('/details/:id', articleStatus)
  router.get('/stats', statistics)

  return router
}
