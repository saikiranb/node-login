const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session =require('express-session') 
const passport =require('passport')

require('./config/passport')(passport)

const app = express()

let url = 'mongodb://localhost:27017/node-passport'
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>console.log('MongoDB connected'))
    .catch(err => console.log(err))

//EJS

app.use(expressLayouts)
app.set('view engine','ejs')

//Body parser
app.use(express.urlencoded({extended: false}))

//Session

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))

app.use(passport.initialize());
app.use(passport.session());

//Flash

app.use(flash())


//Global variables

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg'),
    res.locals.error_msg = req.flash('error_msg'),
    res.locals.error = req.flash('error'),
    next()
})

//Routes
app.use('/',require('./routes/index'))
app.use('/users', require('./routes/users'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server Started on port ${PORT}`))
