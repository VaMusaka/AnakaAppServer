module.exports = data => {
  const { name = '', description = '' } = data

  const validationRules = [
    {
      isLength: [
        {
          name: {
            value: name,
            criteria: { min: 3, max: 64 },
            message: 'Service category name must be between 3 and 64 characters',
          },
          description: {
            value: description,
            criteria: { max: 4056 },
            message: 'Description too long',
          },
        },
      ],
    },
  ]

  const requiredFields = [
    {
      name: {
        value: name,
        message: 'Service category name is required',
      },
    },
    {
      description: {
        value: description,
        message: 'Description is required',
      },
    },
  ]

  return { validationRules, requiredFields }
}
