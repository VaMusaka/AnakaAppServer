const Validate = require('./validate')
const UserRegister = require('./User/Register')

module.exports = {
  ValidateUserRegister: data => Validate(UserRegister, data),
}
