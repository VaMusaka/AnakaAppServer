require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const passport = require('passport')

//DATABASE CONFIGURATION
require('./src/Database/Index')

//INITIALIZE ROUTES
const { User } = require('./src/Routes')

//AUTHENTICATION MIDDLEWARE
const authentication = require('./src/Middleware/Authentication')

//INITIALIZE APP
const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(authentication)
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: false }))

//CONFIGURE PASSPORT AUTHENTICATION
app.use(passport.initialize())
require('./src/Config/Passport')(passport)

//ROUTES
app.use('/api/user', User)

const port = process.env.PORT || 80
app.listen(port, () => console.log(`|| === SERVER RUNNING ON PORT ${port}`))
