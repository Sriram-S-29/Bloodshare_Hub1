const express = require('express')
const admin_route = express()
const adminController = require('../Controllers/adminController')
const { isLogged, isLogout } = require('../middleware/session')

admin_route.set('view engine', 'hbs')
admin_route.set('views','./Views/admin')


admin_route.get('/', adminController.login)
admin_route.post('/loginCheck', adminController.loginCheck)
admin_route.get('/adminHome', adminController.adminHome)
admin_route.get('/adminDonor', adminController.adminDonor)
admin_route.post('/showInfo', adminController.showDonor)
admin_route.get('/status',adminController.userStatusManage)
admin_route.get('/adminCamp', adminController.adminCamp)
admin_route.post('/adminNewCamp', adminController.adminNewCamp)
admin_route.get('/adminCampDetail', adminController.adminCampDetail)
admin_route.get('/adminRequest', adminController.adminRequest)
admin_route.post('/adminRequestDonor', adminController.adminDonorRequest)
admin_route.get('/adminRequestManage', adminController.adminRequestManage)
admin_route.get('/detailsOfHero/:id', adminController.detailsOfHero)
admin_route.get('/appointment', adminController.appointPage)
admin_route.get('/appointOk/:id', adminController.appointOk)
admin_route.post('/requestDelete/:id', adminController.deleteRequest)
admin_route.get('/inventory', adminController.inventoryPage)
admin_route.post('/showIven', adminController.showInven)
admin_route.get('/book', adminController.book)












module.exports = admin_route