module.exports = data => {
  const { email = '' } = data

  const validationRules = [
    {
      isEmail: [
        {
          email: {
            value: email,
            constraint: {},
            message: 'Invalid Email',
          },
        },
      ],
    },
  ]
  const requiredFields = [
    {
      email: {
        value: email,
        message: 'Email field is required',
      },
    },
  ]

  return { validationRules, requiredFields }
}
