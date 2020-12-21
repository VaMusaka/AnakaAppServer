require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
const passport = require('passport')

//DATABASE CONFIGURATION
require('./src/Database/Index')

//INITIALIZE ROUTES
const { User, Customer } = require('./src/Routes/index')

//AUTHENTICATION MIDDLEWARE
const { authentication } = require('./src/Middleware/Authentication')

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
app.use('/api/customer', Customer)

const port = process.env.PORT || 5000
app.get('*', (req, res) => {
  res.send('IT WORKS')
})

app.listen(port, () => console.log(`|| === SERVER RUNNING ON PORT ${port}`))
