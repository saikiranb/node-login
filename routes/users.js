const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport')


router.get('/login', (req, res)=> res.render('login'))

router.get('/register', (req, res)=> res.render('register'))

router.post('/register', (req,res)=>{
    const {name, email, password, confirm_password } = req.body
    let errors = []

    if(!name || !email || !password || !confirm_password){
        errors.push({msg: 'Please fill all the fields'})
    }

    if(password!==confirm_password){
        errors.push({msg: 'Passwords do not match'})
    }

    if(password.length < 6){
        errors.push({msg:'Password should be at least 6 characters'})
    }

    if(errors.length > 0 ){
        res.render('register',{
            errors, name, email, password, confirm_password
        })
    }else{
        User.findOne({email: email})
        .then(user => {
            if(user){ //User already exists
                errors.push({msg: 'Email already registered'})
                res.render('register',{
                    errors, name, email, password, confirm_password
                })
            }else{
                const newUser = new User({
                    name, email, password
                })
                
                bcrypt.genSalt(10, (err,salt)=>{
                    bcrypt.hash(newUser.password, salt, (err,hash) =>{
                        if(err){
                            throw err
                        }else{
                            newUser.password = hash
                            newUser.save()
                            .then(user =>{
                                req.flash('success_msg','You are registerd and can log in')
                                res.redirect('/users/login')
                            })
                            .catch(err=> console.log(err))
                        }
                    })
                })
            }
        })
        

    }
})

//Login Handle

router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)
})

//Logout

router.get('/logout',(req, res,)=>{
    req.logout()
    req.flash('success_msg','You are logged out')
    res.redirect('/users/login')

})

module.exports = router