const express = require('express')
const user_route = express()
const userController = require('../Controllers/userController')
const { isLogged, isLogout } = require('../middleware/session')
const multer = require('multer')
const path = require('path')
const {upload} = require('../helpers/multer')


user_route.set('view engine', 'hbs')
user_route.set('views','./Views/user')

user_route.get('/', userController.login)
user_route.post('/loginCheck', userController.loginCheck)
user_route.get('/home', isLogged,userController.home)
user_route.get('/signup',userController.signup)
user_route.post('/newUser', userController.newUser)
user_route.get('/forgotpage', userController.forget)
user_route.post('/generateOtp', userController.generateOpt)
user_route.post('/verify', userController.otpVerify)
user_route.post('/changePass', userController.changePass)
user_route.get('/profile',isLogged,userController.profilePage)
user_route.get('/status',isLogged,userController.statusPage)
user_route.post('/profileUpdate',upload.array('productimage',3),userController.profileUpdate)
user_route.get('/camp',isLogged,userController.campPage)
user_route.post('/campin/:id',isLogged,userController.campin)
user_route.get('/response',isLogged,userController.respondPage)
user_route.post('/inResponse/:_id',isLogged,userController.respond)
user_route.get('/appointment',isLogged,userController.appointPage)
user_route.post('/appointmentBook',isLogged,userController.appointBook)
user_route.get('/myAppoint',isLogged,userController.myAppointPage)



module.exports = user_route