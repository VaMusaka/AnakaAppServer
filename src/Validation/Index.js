const Validate = require('./validate')
const UserRegister = require('./User/Register')
const UserLogin = require('./User/Login')
const EmailVerification = require('./User/EmailVerification')
const ResetPasswordRequest = require('./User/ResetPasswordRequest')
const ResetPassword = require('./User/ResetPassword')

module.exports = {
  ValidateUserRegister: data => Validate(UserRegister, data),
  ValidateUserLogin: data => Validate(UserLogin, data),
  ValidateEmailVerification: data => Validate(EmailVerification, data),
  ValidateResetPasswordRequest: data => Validate(ResetPasswordRequest, data),
  ValidateResetPassword: data => Validate(ResetPassword, data),
}
