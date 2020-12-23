////================AUTHENTICATION====================///
const Validate = require('./validate')
const UserRegister = require('./User/Register')
const UserLogin = require('./User/Login')
const EmailVerification = require('./User/EmailVerification')
const ResetPasswordRequest = require('./User/ResetPasswordRequest')
const ResetPassword = require('./User/ResetPassword')

////================CUSTOMER====================///
const CreateCustomer = require('./Customer/Create')

////================SERVICE PROVIDER====================///
ServiceProvider = require('./ServiceProvider')

////================COMMON====================///
Address = require('./Common/Address')

module.exports = {
  ////================AUTHENTICATION====================///
  ValidateUserRegister: data => Validate(UserRegister, data),
  ValidateUserLogin: data => Validate(UserLogin, data),
  ValidateEmailVerification: data => Validate(EmailVerification, data),
  ValidateResetPasswordRequest: data => Validate(ResetPasswordRequest, data),
  ValidateResetPassword: data => Validate(ResetPassword, data),

  ////================CUSTOMER====================///
  ValidateCreateCustomer: data => Validate(CreateCustomer, data),

  ////================SERVICE PROVIDER====================///
  ValidateServiceProvider: data => Validate(ServiceProvider, data),

  ////================COMMON====================///
  ValidateAddress: data => Validate(Address, data),
}
