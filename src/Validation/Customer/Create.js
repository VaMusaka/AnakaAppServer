module.exports = data => {
  const { line1 = '', primaryLocation = '', city = '', county = '', country = '', postcode = '' } = data

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
          postcode: {
            value: postcode,
            criteria: { min: 3, max: 64 },
            message: 'Invalid Postal Code ',
          },
          primaryLocation: {
            value: primaryLocation,
            criteria: { min: 3, max: 64 },
            message: 'Please select a primary location ',
          },
        },
      ],
    },
    {
      isPostalCode: [
        {
          postcode: {
            value: postcode,
            criteria: ['GB'],
            message: 'Invalid Postcode',
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
      postcode: {
        value: postcode,
        message: 'Postal/ZipCode Code is required',
      },
    },
  ]

  return { validationRules, requiredFields }
}
