const express = require('express')
const router = express.Router()
const { UserController } = require('../../Controller/Index')
const { Register, Login, VerifyEmail, ResetPasswordRequest, ResetPassword } = UserController

router.post('/register', Register)

router.post('/login', Login)

router.post('/verify-email', VerifyEmail)

router.post('/reset-password-request', ResetPasswordRequest)

router.post('/reset-password', ResetPassword)

module.exports = router
