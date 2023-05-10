const user = require('../models/userModel')
const bcrypt = require('bcrypt')
const randomString = require('randomString')
const { findByIdAndUpdate } = require('../models/userModel')

// function to be called inorder to bcrypt password
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10)
        return passwordHash
    } catch (error) {
        console.log(error.message);
    }
}
//--------------------------------

// To load or render URL: /admin
const loadLogin = async (req, res) => {
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}
// ------------------


// To verify Admin credentials
const verifyAdmin = async (req, res) => {
    try {
        const emailEntered = req.body.email
        const passwordEntered = req.body.password
        const adminDb = await user.findOne({ email: emailEntered })

        if (adminDb) {
            const matchPassword = await bcrypt.compare(passwordEntered, adminDb.password)
            if (matchPassword) {
                if (adminDb.is_admin === '0') {
                    res.render('login', { message: 'You are not ADMIN' })
                }
                else {
                    req.session.admin_id = adminDb._id
                    res.redirect('/admin/home')
                }
            }
            else {
                res.render('login', { message: 'Entered password is wrong' })
            }
        }
        else {
            res.render('login', { message: 'Entered email ID is wrong' })
        }
    } catch (error) {
        console.log(error.message);
    }
}
// ------------------


// To load URL: home or redirect to home when admin verified
const loadHome = async (req, res) => {
    try {
        const adminDocument = await user.findById({ _id: req.session.admin_id })
        res.render('home', { message: adminDocument })
    } catch (error) {
        console.log(error.message);
    }
}
// ------------------


// To logout from admin home page
const logout = async (req, res) => {
    try {
        req.session.destroy()
        res.redirect('/admin')
    } catch (error) {
        console.log(error.message);
    }
}
// ----------------


// To load URL: admin/dashboard
const loadDashboard = async (req, res) => {
    try {
        const userDatas = await user.find({ is_admin: 0 })
        res.render('dashboard', { message: userDatas })
    } catch (error) {
        console.log(error.message);
    }
}
// ---------------


// To load URL: admin/add-uer 
const loadAdduser = async (req, res) => {
    try {
        res.render('addUser')
    } catch (error) {
        console.log(error.message);
    }
}
// --------------


// To add new user to database
const addNewUser = async (req, res) => {
    try {
        if (/^\s*$/.test(req.body.name.trim())) {
            res.redirect('/admin/dashboard')
        } else {
            const email = req.body.email
            const emailExists = await user.findOne({ email: email })
            console.log(emailExists);
            if (emailExists) {
                res.render('addUser', { alert: 'Email ID already registered' })
            } else {
                nameEntered = req.body.name
                mobileEntered = req.body.mobile
                emailEntered = req.body.email
                createdPassword = randomString.generate(8)

                hashedPassword = await securePassword(createdPassword)

                const newUser = await new user({
                    name: nameEntered,
                    mobile: mobileEntered,
                    email: emailEntered,
                    password: hashedPassword,
                    is_admin: 0
                })

                const addedUser = await newUser.save()

                if (addedUser) {
                    res.redirect('/admin/dashboard')
                } else {
                    res.render('addUser', { message: 'Something wrong' })
                }
            }

        }




    } catch (error) {
        console.log(error.message);
    }
}
// --------------


// To load URL: admin/edit-uer 
const loadEditUser = async (req, res) => {
    try {
        const id = req.query.id
        const userData = await user.findById({ _id: id })
        if (userData) {
            res.render('edit-user', { message: userData })
        }
        else {
            res.redirect('/admin/dashboard')
        }

    } catch (error) {
        console.log(error.message);
    }
}
// --------------

// To update the edit details to db
const updateUser = async (req, res) => {
    try {
        if (/^\s*$/.test(req.body.name.trim())) {
            res.redirect('/admin/dashboard')
        }
        else {
            const userData = await user.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, mobile: req.body.mobile, email: req.body.email } })
            res.redirect('/admin/dashboard')
        }
    } catch (error) {
        console.log(error.message);
    }
}
// --------------

// To delete
const deleteUser = async (req, res) => {
    try {
        const id = req.query.id
        await user.deleteOne({ _id: id })
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}
// --------------

// To search from dashboard
const searchUser = async (req, res) => {
    try {
        const searchValue = req.body.search;
        const search = searchValue.trim()
        if (search !== '') {
            let searched = await user.find({ $and: [{ name: { $regex: `^${search}`, $options: 'i' } }, { is_admin: 0 }] })
            res.render('dashboard', { message: searched })
        }
        console.log(searchValue);
    } catch (error) {
        console.log(error.message);
    }
}
// --------------

module.exports = {
    loadLogin,
    verifyAdmin,
    loadHome,
    logout,
    loadDashboard,
    loadAdduser,
    addNewUser,
    loadEditUser,
    updateUser,
    deleteUser,
    searchUser
} 