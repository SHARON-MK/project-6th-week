const user = require('../models/userModel')
const bcrypt = require('bcrypt')


// function to be called inorder tobcrypt password
const securePassword = async (password) =>{
    try {
        const passwordHash = await bcrypt.hash(password,10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}
//--------------------------------


// To load or render URL: register
const loadRegister = async(req,res)=>{
    try {
        res.render('registration')
    } catch (error) {
        console.log(error.message);
    }
}
//--------------------------------


// To insert registration data to database when clicked the register button
const insertUser = async(req,res)=>{
    try {
        const email= req.body.email
        const emailExists = await user.findOne({email:email}) 
        console.log(emailExists);
        if(emailExists){
              res.render('registration',{alert:'Email ID already registered'})
        }
        else{
            const bcryptedPassword = await securePassword(req.body.password)
            const userData = new user({
               name:req.body.name,
               email:req.body.email,
               mobile:req.body.mobile,
               password:bcryptedPassword,
               is_admin:0
            })
            const result = await userData.save()
            if(result){
               res.render('registration',{message:"Your registration has been successfully done..."})
            }
            else{
               res.render('registration',{message:"Registration Failed"})
            }
   
        }

        
    } catch (error) {
        console.log(error.message);
    }
}
//--------------------------------


// to load or render URL: login page
const loadLogin = async(req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(eror.message);
    }
}
// ----------------------------


// To verify the login credentials
const verifyLogin = async(req,res)=>{
    try {
          const emailEntered = req.body.email
          const passwordEntered = req.body.password

          const userDb = await user.findOne({email:emailEntered})

          if(userDb)
          {
            const passwordMatch = await bcrypt.compare(passwordEntered,userDb.password)
            if(passwordMatch)
            {
                req.session.user_id = userDb._id
                res.redirect('/home')
            }
            else
            {
                res.render('login',{message:'Incorrect Password'})
            }
          }
          else
          {
              res.render('login',{message:'Incorrect Email'})
          }
        
    } catch (error) {
        console.log(error.message);
    }
}

//--------------------------------


// To load or render URL : home
const loadHome = async(req,res)=>{
    try {
        res.render('home')
    } catch (error) {
        console.log(error.message);
    }
}
// -------------------


// When Logout button clicked
const userLogout = async(req,res)=>{
    try {
        req.session.destroy()
        res.redirect('/')
    } catch (error) {
        console.log(error.mesage);
    }
}

module.exports ={
    loadRegister,
    insertUser,
    loadLogin,
    verifyLogin,
    loadHome,
    userLogout
}