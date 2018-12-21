const routes = require('express').Router()
const userRoutes = require('./user')
const {checkLogin} = require('../helpers')
const PostController = require('../controllers/PostController.js')


routes.get('/', function(req, res) {
  res.render('home')
})

routes.get('/globalpost', checkLogin, PostController.getPost)

routes.get('/globalpost/id', checkLogin, PostController.getPostIndonesia)

routes.use('/user', userRoutes)

module.exports = routes