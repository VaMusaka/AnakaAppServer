const express = require('express')
const router = express.Router()
const { UserController } = require('../../Controller/Index')
const { jwtAuth } = require('../../Middleware/Authentication')

const {
  Register,
  Login,
  VerifyEmail,
  ResetPasswordRequest,
  ResetPassword,
  SendEmailVerificationCode,
  getCurrentUser,
} = UserController

router.post('/register', Register)

router.post('/login', Login)

router.get('/', [jwtAuth], getCurrentUser)

router.post('/verify-email', VerifyEmail)

router.post('/send-email-verification-code', SendEmailVerificationCode)

router.post('/reset-password-request', ResetPasswordRequest)

router.post('/reset-password', ResetPassword)

module.exports = router
