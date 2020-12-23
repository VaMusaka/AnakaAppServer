module.exports = data => {
  const { line1 = '', city = '', county = '', country = '', postal_code = '' } = data

  const validationRules = [
    {
      isLength: [
        {
          line1: {
            value: line1,
            criteria: { min: 3, max: 64 },
            message: 'Address Line 1 must be between 3 and 64 characters',
          },
          city: {
            value: city,
            criteria: { min: 3, max: 64 },
            message: 'City must be between 3 and 64 characters',
          },
          county: {
            value: county,
            criteria: { min: 3, max: 64 },
            message: 'County must be between 3 and 64 characters',
          },
          country: {
            value: country,
            criteria: { min: 3, max: 64 },
            message: 'Country must be between 3 and 64 characters',
          },
          postal_code: {
            value: postal_code,
            criteria: { min: 3, max: 64 },
            message: 'Invalid Postal Code ',
          },
        },
      ],
    },
    {
      isPostalCode: [
        {
          postal_code: {
            value: postal_code,
            criteria: ['GB'],
            message: 'Invalid Post Code',
          },
        },
      ],
    },
  ]

  const requiredFields = [
    {
      line1: {
        value: line1,
        message: 'Address Line 1 is required',
      },
    },
    {
      city: {
        value: city,
        message: 'City is required',
      },
    },
    {
      county: {
        value: county,
        message: 'County/Province is required',
      },
    },
    {
      country: {
        value: country,
        message: 'Country is required',
      },
    },
    {
      postal_code: {
        value: postal_code,
        message: 'Postal/ZipCode Code is required',
      },
    },
  ]

  return { validationRules, requiredFields }
}
