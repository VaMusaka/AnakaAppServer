module.exports = data => {
  const { email = '', password = '' } = data

  const validationRules = [
    {
      isLength: [
        {
          email: {
            value: email,
            criteria: { min: 3, max: 64 },
            message: 'Email must be between 3 and 64 characters',
          },
        },
        {
          password: {
            value: password,
            criteria: { min: 8, max: 34 },
            message: 'Password must be at least 8 characters',
          },
        },
      ],
    },
    {
      isEmail: [
        {
          email: {
            value: email,
            criteria: {},
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
        message: 'Email is required',
      },
    },
    {
      password: {
        value: password,
        message: 'Password is required',
      },
    },
  ]

  return { validationRules, requiredFields }
}
