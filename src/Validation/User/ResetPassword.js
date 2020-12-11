module.exports = data => {
  const { email = '', passcode = '', password = '', confirm_password = '' } = data

  const validationRules = [
    {
      isLength: [
        {
          passcode: {
            value: passcode,
            criteria: { min: 6, max: 6 },
            message: 'Invalid passcode',
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
          passcode: {
            value: passcode,
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
      passcode: {
        value: passcode,
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
