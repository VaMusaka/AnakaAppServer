const { badRequest, notFound, notAllowed } = require('@hapi/boom')
const { isEmpty } = require('lodash')
const { models } = require('mongoose')
const { ServiceProvider } = models
const { ValidateServiceProvider, ValidateAddress } = require('../Validation/Index')
const { createStripeServiceProvider, updateStripeServiceProvider } = require('./Stripe')
const { savePrimaryServiceCategories, getAddressFromPostCode } = require('./Common')

//VALIDATE INPUT
const validateInput = data => {
  const {
    name,
    business_type,
    headline,
    description,
    primaryLocation,
    line1,
    line2,
    city,
    county,
    country,
    postal_code,
  } = data

  //validate service provider
  const validateServiceProvider = ValidateServiceProvider({
    name,
    business_type,
    headline,
    description,
    primaryLocation,
  })
  const validateAddress = ValidateAddress({
    line1,
    line2,
    city,
    county,
    country,
    postal_code,
  })

  return {
    isValid: !validateServiceProvider.isValid && !validateAddress.isValid,
    errors: { ...validateAddress.errors, ...validateServiceProvider.errors },
  }
}

//CREATE SERVICE PROVIDER FROM LOGGED IN USER
const createServiceProvider = async (req, res) => {
  const { user, body } = req
  const { email, id, phone } = user
  const {
    name,
    business_type,
    headline,
    description,
    line1,
    line2,
    city,
    county,
    country,
    postal_code,
    primaryLocation,
  } = body

  //GET LAT LONG
  let { latitude, longitude } = body

  if (!latitude || !longitude) {
    try {
      const results = await getAddressFromPostCode(postal_code)
      latitude = results.latitude
      longitude = results.longitude
    } catch (err) {
      console.log(err)
    }
  }

  const address = { line1, line2, city, country, postal_code }

  //validate service provider
  const { isValid, errors } = await validateInput(
    name,
    business_type,
    headline,
    description,
    line1,
    line2,
    city,
    county,
    country,
    postal_code,
    primaryLocation
  )

  if (!isValid) {
    const { output } = badRequest('Invalid Service Provider Input')
    return res.status(output.statusCode).json({ ...errors, output })
  }

  try {
    //check user already a service provider
    const isServiceProvider = await ServiceProvider.findOne({ user: id })

    if (isServiceProvider) {
      const { output } = badRequest('User already service provider')
      return res.status(output.statusCode).json(output)
    }

    //create stripe account
    const stripeServiceProvider = await createStripeServiceProvider({
      email,
      country,
      type: 'express',
      business_profile: {
        name,
        product_description: description,
        support_address: address,
        support_phone: phone,
      },

      business_type,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    const newServiceProvider = new ServiceProvider({
      user: id,
      name,
      headline,
      business_type,
      description,
      stripeAccountId: stripeServiceProvider.id,
      address: { ...address, county, latitude, longitude },
      primaryLocation,
    })

    const savedServiceProvider = await newServiceProvider.save()

    if (!savedServiceProvider) {
      const { output } = badRequest('Error creating service provider')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    return res.json(savedServiceProvider)
  } catch (err) {
    const { output } = badRequest('Error creating service provider')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

//GET SERVICE PROVIDER WITH PARAM ID
const getServiceProvider = async (req, res) => {
  const { id } = req.params
  try {
    const serviceProvider = await ServiceProvider.findById(id)
    if (!serviceProvider) {
      const { output } = notFound('Service Provider not found')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    res.json(serviceProvider)
  } catch (err) {
    const { output } = badRequest('Error getting service provider')
    return res.status(output.statusCode).json({ ...err, flash: output.payload.message, output })
  }
}

//GET LIST OF SERVICE PROVIDERS
const getServiceProviders = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.find(id)
    if (!serviceProvider) {
      const { output } = notFound('Service Providers not found')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    res.json(serviceProvider)
  } catch (err) {
    const { output } = badRequest('Error getting service providers')
    return res.status(output.statusCode).json({ ...err, flash: output.payload.message, output })
  }
}

//UPDATE LOGGED-IN SERVICE PROVIDER
const updateServiceProvider = async (req, res) => {
  const { user, body } = req
  const { id, phone } = user
  const {
    name,
    business_type,
    description,
    headline,
    line1,
    line2,
    city,
    county,
    country,
    postal_code,
    primaryLocation,
  } = body
  let { latitude, longitude } = body
  const address = { line1, line2, city, country, postal_code }

  //GET LAT LONG
  if (!latitude || !longitude) {
    const results = await getAddressFromPostCode(postal_code)
    latitude = results.latitude
    longitude = results.longitude
  }
  //validate service provider
  const { isValid, errors } = await validateInput(
    name,
    business_type,
    headline,
    description,
    line1,
    line2,
    city,
    county,
    country,
    postal_code,
    primaryLocation
  )

  if (!isValid) {
    const { output } = badRequest('Invalid Service Provider Input')
    return res.status(output.statusCode).json({ ...errors, output })
  }

  try {
    const updateServiceProvider = await ServiceProvider.findOne({ user: id })

    //update stripe account
    const stripeServiceProvider = await updateStripeServiceProvider(updateServiceProvider.stripeAccountId, {
      business_profile: {
        name,
        product_description: description,
        support_address: address,
        support_phone: phone,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })

    if (!stripeServiceProvider) {
      const { output } = badRequest('Error updating service provider')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    //save updated serviceProvider
    const updatedServiceProvider = await ServiceProvider.findOneAndUpdate(
      { user: id },
      {
        $set: {
          address: { ...address, county, latitude, longitude },
          primaryLocation,
          business_type,
          name,
          description,
          headline,
        },
      },
      { $new: true }
    )

    if (!updatedServiceProvider) {
      const { output } = badRequest('Error updating service provider')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    return res.json(updatedServiceProvider)
  } catch (err) {
    const { output } = badRequest('Error updating service provider')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

//UPDATE SERVICE PROVIDER PRIMARY SERVICES
const serviceProviderPrimaryServiceCategories = async (req, res) => {
  const { body, user } = req
  const { primaryServiceCategories } = body

  if (isEmpty(primaryServiceCategories)) {
    const { output } = notAllowed('Please select service categories')
    return res.status(output.statusCode).json({ output })
  }

  ///GET CUSTOMER AND UPDATE
  await savePrimaryServiceCategories(ServiceProvider, primaryServiceCategories, user, req, res)
}

module.exports = {
  createServiceProvider,
  getServiceProvider,
  getServiceProviders,
  updateServiceProvider,
  serviceProviderPrimaryServiceCategories,
}
