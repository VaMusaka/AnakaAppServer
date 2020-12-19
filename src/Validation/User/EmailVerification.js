module.exports = data => {
  const { email = '', emailVerificationToken = '' } = data

  const validationRules = [
    {
      isLength: [
        {
          emailVerificationToken: {
            value: emailVerificationToken,
            criteria: { min: 4, max: 4 },
            message: 'Invalid verification code',
          },
        },
      ],
      isNumeric: [
        {
          emailVerificationToken: {
            value: emailVerificationToken,
            criteria: {},
            message: 'Invalid verification code',
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
            message: 'Invalid verification code',
          },
        },
      ],
    },
  ]
  const requiredFields = [
    {
      emailVerificationToken: {
        value: emailVerificationToken,
        message: 'Invalid verification code',
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
