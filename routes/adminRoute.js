const express = require('express')
const adminRoute = express()

const authAdmin = require('../middleware/authAdmin')
const session = require('express-session')
const config = require('../config/config')
adminRoute.set(session({
    secret:config.sessionSecret,
    saveUninitialized:true,
    resave:false,
    Cookie:{maxAge : 120000},

}))

adminRoute.set('view engine','ejs')
adminRoute.set('views','./views/admin')

adminRoute.use(express.json())
adminRoute.use(express.urlencoded({extended:true}))

const adminController = require('../controllers/adminController')

adminRoute.get('/',authAdmin.isLogout,adminController.loadLogin)
adminRoute.post('/',adminController.verifyAdmin)

adminRoute.get('/home',authAdmin.isLogin,adminController.loadHome)

adminRoute.get('/logout',authAdmin.isLogin,adminController.logout)

adminRoute.get('/dashboard',authAdmin.isLogin,adminController.loadDashboard)
adminRoute.post('/dashboard',adminController.searchUser)

adminRoute.get('/add-user',authAdmin.isLogin,adminController.loadAdduser)
adminRoute.post('/add-user',adminController.addNewUser)

adminRoute.get('/edit-user',authAdmin.isLogin,adminController.loadEditUser)
adminRoute.post('/edit-user',authAdmin.isLogin,adminController.updateUser)


adminRoute.get('/delete-user',adminController.deleteUser)

adminRoute.get('*',(req,res)=>{
    res.redirect('/admin')
})

module.exports = adminRoute

