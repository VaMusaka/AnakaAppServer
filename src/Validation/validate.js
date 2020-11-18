const { isEmpty } = require('lodash')
const { runValidationRules, runRequiredFields } = require('./validationRunner')

module.exports = (validator, data) => {
  const { validationRules, requiredFields } = validator(data)
  const errors = Object.assign(runValidationRules(validationRules), runRequiredFields(requiredFields))

  return {
    errors,
    isValid: isEmpty(errors),
  }
}
