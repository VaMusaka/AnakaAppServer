const validator = require('validator')

module.exports = {
  runValidationRules: validationRules => {
    const errors = {}
    validationRules.forEach(rule => {
      const ruleName = Object.keys(rule)[0]
      rule[ruleName].forEach(criteria => {
        const fieldName = Object.keys(criteria)[0]
        if (!validator[ruleName](criteria[fieldName].value, criteria[fieldName].criteria)) {
          Object.assign(errors, { [fieldName]: criteria[fieldName].message })
        }
      })
    })
    return errors
  },
  runRequiredFields: requiredFields => {
    const errors = {}
    requiredFields.forEach(field => {
      const fieldName = Object.keys(field)[0]
      const criteria = field[fieldName]
      if (validator.isEmpty(criteria.value)) {
        Object.assign(errors, { [fieldName]: criteria.message })
      }
    })
    return errors
  },
}
