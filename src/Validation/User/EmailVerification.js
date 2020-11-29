module.exports = data => {
  const { email = '', token = '' } = data

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
      ],
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
            message: 'Invalid email',
          },
        },
      ],
    },
  ]
  const requiredFields = [
    {
      token: {
        value: token,
        message: 'Token not supplied',
      },
    },
    {
      email: {
        value: email,
        message: 'Email not supplied',
      },
    },
  ]

  return { validationRules, requiredFields }
}
