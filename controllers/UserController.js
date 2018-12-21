const {User, Relation, Post, Date} = require('../models')
const {checkHash} = require('../helpers')

class UserController {
  static registerForm(req, res) {
    res.render('register')
  }

  static create(req, res) {
    let obj = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      description: req.body.description,
      country: req.body.country,
      avatar: null,
      point: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log(obj);

    User.create(obj)
      .then(function(user) {
        res.render('login')
      })
      .catch(function(err) {
        // res.send(err.message)
        res.render('error', {error:err.message})
      })
  }

  static loginForm(req, res) {
    res.render('login')
  }

  static login(req, res) {
    User.findOne({where: {email: req.body.email}})
      .then(function(user) {
        if (user) {
          let data = user.dataValues
          if (checkHash(req.body.password, data.password)) {
            req.session.user = {
              id: data.id,
              gender: data.gender,
              email: data.email,
              country: data.country,
              first_name: data.first_name,
              last_name: data.last_name,
              username: data.username
            }
            // res.send('berhasil login')
            res.redirect(`/user/dashboard`)
          }
          else {
            let message = `email atau password anda salah, coba ingat ingat`
            throw new Error(message)
            // res.redirect('error', {err:message})
          }
        }
        else {
          let message = `email atau password anda salah, coba ingat ingat`
          throw new Error(message)
          // res.render('error', {err:message})
        }
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
        // res.render('error', {err:err})
      })
  }

  static profile(req, res) {
    let dataUser = null
    User.findByPk(req.params.id)
      .then(function(user) {
        dataUser = user
        return Post.findAll({where: {UserId: req.params.id}})
      })
      .then(function(posts) {
        res.render('profile', {data: dataUser, posts: posts})
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static editProfile(req, res) {
    User.findByPk(req.session.user.id)
      .then(function(user) {
        res.render('edit-profile', {data: user})
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static update(req, res) {
    let obj = {
      first_name: req.file.first_name,
      last_name: req.file.last_name,
      avatar: req.file.filename,
      country: req.file.country,
      description: req.file.description
    }

    User.update(obj, {where: {id: req.session.user.id}})
      .then(function(user) {
        res.redirect('/user/edit-profile')
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static dashboard(req, res) {
    let userData = null
    let dateDatas = null

    User.findByPk(req.session.user.id, {include: ['Target', 'Source']})
      .then(function(user) {
        userData = user
        return Date.findAll({where: {ReceiverId: req.session.user.id}, include: ['Pengirim']})
      })
      .then(function(dates) {
        // res.send(dates)
        dateDatas = dates
        return Date.findAll({where: {SenderId: req.session.user.id}, include: ['Penerima']})
      })
      .then(function(reqDates) {
        // res.send(reqDates)
        res.render('dashboard', {data: userData, dates: dateDatas, reqDates: reqDates})
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static addrelation(req, res) {
    if (req.session.user.id == req.params.id) {
      res.render('error', {error:'Cannot add yourself to your own relation'})
    }
    else {
      let obj = {
        UserId: req.session.user.id,
        FriendId: req.params.id,
        status: "Pending",
        createdAt: new Date,
        updatedAt: new Date
      }

      Relation.create(obj)
      .then(function() {
        res.send('your request has been sent')
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
    }
  }

  static accept(req, res) {
    let obj = {
      status: "OnRelation"
    }
    Relation.update(obj, {where: {UserId: req.params.friendId, FriendId: req.session.user.id}})
      .then(function (user) {
        res.send('Add someone to your relation')
      })
      .catch(function (err) {
        res.render('error', {error:err.message})
      })
  }

  static ignore(req, res) {
    Relation.destroy({where: {UserId: req.params.friendId, FriendId: req.session.user.id}})
      .then(function (user) {
        res.send('Ignoring someone')
      })
      .catch(function (err) {
        res.render('error', {error:err.message})
      })
  }

  static friendlist(req, res) {
    User.findByPk(req.session.user.id, {include: ['Target', 'Source']})
      .then(function(user) {
        // res.send(user)
        res.render('friendlist', {data: user})
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static post(req, res) {
    let obj = {
      UserId: req.session.user.id,
      message: req.body.message
    }

    Post.create(obj)
      .then(function(post) {
        res.redirect('/user/dashboard')
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static askfordate(req, res) {
    User.findByPk(req.params.id)
      .then(function(user) {
        res.render('date', {data: user})
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static createDate(req, res) {
    let obj = {
      SenderId: req.session.user.id,
      ReceiverId: req.params.id,
      message: req.body.message,
      status: "Pending"
    }

    Date.create(obj)
      .then(function (user) {
        res.redirect('/user/dashboard')
      })
      .catch(function (err) {
        res.render('error', {error:err.message})
      })
  }

  static acceptDate(req, res) {
    let obj = {
      status: "Accepted"
    }
    Date.update(obj, {where: {id: req.params.id}})
      .then(function() {
        res.redirect('/user/dashboard')
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static ignoreDate(req, res) {
    let obj = {
      status: "Rejected"
    }
    Date.update(obj, {where: {id: req.params.id}})
      .then(function() {
        res.redirect('/user/dashboard')
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static lovepoints(req, res) {
    Date.findByPk(req.params.id, {include: ['Pengirim']})
      .then(function(date) {
        res.render('lovepoints',{data: date} )
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static givelovepoints(req, res) {
    User.findByPk(req.body.targetId)
      .then(function(user) {
        let obj = {
          point: Number(user.dataValues.point) + Number(req.body.point)
        }
        return User.update(obj, {where: {id: req.body.targetId}})
      })
      .then(function() {
        return Date.update({status: "Completed"}, {where: {id: req.params.id}})
      })
      .then(function() {
        res.redirect('/user/dashboard')
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static logout(req, res) {
    req.session.destroy(function(err) {
      if (err) {
        res.render('error', {error:err.message})
      }
    })
    res.redirect('/')
  }

  static searchFriend(req, res) {
    User.findByPk(req.session.user.id)
      .then(function(user) {
        res.render('searchfriend', {data: user})
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }

  static searchFriendResult(req, res) {
    let userData = null
    User.findByPk(req.session.user.id)
      .then(function(user) {
        userData = user
        return User.findOne({where: {username: req.body.username}})
      })
      .then(function(userResult) {
        res.render('searchfriendresult', {data: userData, result: userResult})
      })
      .catch(function(err) {
        res.render('error', {error:err.message})
      })
  }
}

module.exports = UserController