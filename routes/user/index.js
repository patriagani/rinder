const routes = require('express').Router()
const {checkLogin} = require('../../helpers')
const multer  = require('multer')
const UserController = require('../../controllers/UserController.js')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/profilepic')
  },
  filename: function (req, file, cb) {
    let type = file.mimetype.split('/')[1]
    let name = file.originalname.split('.')[0]
    cb(null, Date.now()+ name + '.'+ type)
  }
})

const upload = multer({ storage: storage })

routes.get('/register', UserController.registerForm)

routes.post('/register', UserController.create)

routes.get('/login', UserController.loginForm)

routes.post('/login', UserController.login)

routes.post('/post', checkLogin, UserController.post)

routes.get('/dashboard',checkLogin, UserController.dashboard)

routes.get('/addrelation/:id', checkLogin, UserController.addrelation)

routes.get('/accept/:friendId', UserController.accept)

routes.get('/ignore/:friendId', UserController.ignore)

routes.get('/profile/:id',checkLogin ,UserController.profile)

routes.get('/edit-profile', checkLogin, UserController.editProfile)

routes.post('/edit-profile', checkLogin, upload.single('avatar'), UserController.update)

routes.get('/friendlist', checkLogin, UserController.friendlist)

routes.get('/askfordate/:id', checkLogin, UserController.askfordate)

routes.post('/askfordate/:id', checkLogin, UserController.createDate)

routes.post('/askfordate/:id', checkLogin, UserController.createDate)

routes.get('/acceptdate/:id', checkLogin, UserController.acceptDate)

routes.get('/ignoredate/:id', checkLogin, UserController.ignoreDate)

routes.get('/givelovepoints/:id', checkLogin, UserController.lovepoints)

routes.post('/givelovepoints/:id', checkLogin, UserController.givelovepoints)

routes.get('/logout', checkLogin, UserController.logout)

routes.get('/searchfriend', checkLogin, UserController.searchFriend)

routes.post('/searchfriend', checkLogin, UserController.searchFriendResult)












module.exports = routes