require('./config/dbconnect')()
const express = require('express')
const hbs = require('express-handlebars')
const session = require('express-session')
const handlebars = require('handlebars')
const app = express()
 const adminRoute = require('./routes/adminRoute')  
const userRoute = require('./routes/userRoute')


app.use(express.static(__dirname ))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret: 'your_secret_here',
    resave: false,
    saveUninitialized: true,
    
  }));


// For admin
app.use('/admin',adminRoute) 

//For user routes
app.use('/', userRoute)


app.listen(process.env.PORT || 3001)





