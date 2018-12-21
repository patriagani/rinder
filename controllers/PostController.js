const {User, Relation, Post} = require('../models')
const {checkHash} = require('../helpers')
const translate = require('../helpers/translate.js')

class PostController {
  static getPost(req, res) {
    Post.findAll({include: [{model: User}], order: [['createdAt','DESC']]})
      .then(function(posts) {
        res.render('globalpost', {data: posts})
      })
      .catch(function(err) {
        res.send(err.message)
      })
  }

  static getPostIndonesia(req, res) {
    Post.findAll({include: [{model: User}], order: [['createdAt','DESC']]})
      .then(function(posts) {
        let postTranslate =
        posts.map(function(post) {
          return translate(post, req.session.user.country)
        })
        return Promise.all(postTranslate)
      })
      .then(function(newPosts) {
        res.render('globalpost', {data: newPosts})
      })
      .catch(function(err) {
        res.send(err.message)
      })
  }
}

module.exports = PostController