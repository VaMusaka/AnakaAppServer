module.exports = data => {
  const { email = '', token = '', password = '', confirm_password = '' } = data

  const validationRules = [
    {
      isLength: [
        {
          token: {
            value: token,
            criteria: { min: 4, max: 4 },
            message: 'Invalid token',
          },
        },
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
      isNumeric: [
        {
          token: {
            value: token,
            criteria: {},
            message: 'Invalid token',
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
    {
      equals: [{ confirm_password: { value: confirm_password, criteria: password, message: 'Passwords must match' } }],
    },
  ]

  const requiredFields = [
    {
      token: {
        value: token,
        message: 'Invalid token.',
      },
    },
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
    {
      confirm_password: {
        value: confirm_password,
        message: 'Confirm password is required',
      },
    },
  ]

  return { validationRules, requiredFields }
}
