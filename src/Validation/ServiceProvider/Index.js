module.exports = data => {
  const { name = '', primaryLocation = '', business_type = '', headline = '', description = '' } = data

  const validationRules = [
    {
      isLength: [
        {
          name: {
            value: name,
            criteria: { min: 3, max: 64 },
            message: 'Account name must be between 3 and 64 characters',
          },
          business_type: {
            value: business_type,
            criteria: { min: 3, max: 64 },
            message: 'Business Type must be between 3 and 64 characters',
          },
          headline: {
            value: headline,
            criteria: { max: 256 },
            message: 'Headline must be less than 256 characters',
          },
          description: {
            value: description,
            criteria: { max: 4056 },
            message: 'Description too long',
          },
          primaryLocation: {
            value: primaryLocation,
            criteria: { min: 3, max: 10 },
            message: 'Please select a primary location ',
          },
        },
      ],
      isPostalCode: [
        {
          primaryLocation: {
            value: primaryLocation,
            criteria: ['GB'],
            message: 'Invalid Post Code',
          },
        },
      ],
    },
  ]

  const requiredFields = [
    {
      name: {
        value: name,
        message: 'Account name is required',
      },
    },
    {
      business_type: {
        value: business_type,
        message: 'Select Business Type',
      },
    },
    {
      description: {
        value: description,
        message: 'Description is required',
      },
    },
    {
      primaryLocation: {
        value: primaryLocation,
        message: 'Primary Location is required',
      },
    },
  ]

  return { validationRules, requiredFields }
}
