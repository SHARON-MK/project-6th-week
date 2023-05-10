const express = require('express')
const user_route = express ()
const auth = require('../middleware/auth')
const userController = require('../controllers/userController')

const session = require('express-session')
const config = require('../config/config')
const { Cookie } = require('express-session')

user_route.set('view engine','ejs')
user_route.set('views','./views/users')

user_route.use(session({
    secret:config.sessionSecret,
    saveUninitialized:true,
    resave:false,
    Cookie:{maxAge : 120000},
}))

user_route.use(express.json())
user_route.use(express.urlencoded({extended:true}))

user_route.get('/register',auth.isLogout,userController.loadRegister)
user_route.post('/register',userController.insertUser)

user_route.get('/login',auth.isLogout,userController.loadLogin)
user_route.get('/',auth.isLogout,userController.loadLogin)

user_route.post('/login',auth.isLogout,userController.verifyLogin)

user_route.get('/home',auth.isLogin,userController.loadHome)

user_route.get('/logout',auth.isLogin,userController.userLogout)

module.exports = user_route