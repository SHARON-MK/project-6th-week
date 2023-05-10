const mongoose = require('mongoose')
mongoose.connect("mongodb://127.0.0.1:27017/ums_project")

const express = require('express')
const app = express()

app.use((req, res, next) => {
    res.header(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next();
  });

// for user routes
const userRoute = require('./routes/userRoute')
app.use('/',userRoute)

// for admin routes
const adminRoute = require('./routes/adminRoute')
app.use('/admin',adminRoute)

app.listen(4000, ()=> console.log("SERver has started working"))