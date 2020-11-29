module.exports = data => {
  const {
    firstname = '',
    lastname = '',
    email = '',
    // phone = '',
    type = '',
    password = '',
    confirm_password = '',
  } = data

  const validationRules = [
    {
      isLength: [
        {
          firstname: {
            value: firstname,
            criteria: { min: 3, max: 34 },
            message: 'Firstname must be between 3 and 34 characters',
          },
        },
        {
          lastname: {
            value: lastname,
            criteria: { min: 3, max: 34 },
            message: 'Lastname must be between 3 and 34 characters',
          },
        },
        {
          email: {
            value: email,
            criteria: { min: 3, max: 64 },
            message: 'Email must be between 3 and 64 characters',
          },
        },
        /* {
           phone: {
             value: phone,
             criteria: { min: 10, max: 15 },
             message: 'Email must be between 10 and 15 characters',
           },
         },*/
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
    // {
    //   isMobilePhone: [
    //     {
    //       phone: {
    //         value: phone,
    //         criteria: 'en-GB',
    //         message: 'Invalid phone number',
    //       },
    //     },
    //   ],
    // },
    {
      equals: [{ confirm_password: { value: confirm_password, criteria: password, message: 'Passwords must match' } }],
    },
  ]

  const requiredFields = [
    // {
    //   phone: {
    //     value: phone,
    //     message: 'Phone number is required',
    //   },
    // },
    {
      firstname: {
        value: firstname,
        message: 'Firstname is required',
      },
    },
    {
      lastname: {
        value: lastname,
        message: 'Lastname is required',
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
    {
      type: {
        value: type,
        message: 'You must select an account type',
      },
    },
  ]

  return { validationRules, requiredFields }
}
