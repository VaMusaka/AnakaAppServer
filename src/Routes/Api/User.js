const express = require('express')
const router = express.Router()
const { UserController } = require('../../Controller')
const { Register } = UserController

router.post('/register', Register)

module.exports = router
