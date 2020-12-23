const { badRequest, notFound, notAllowed } = require('@hapi/boom')
const { isEmpty } = require('lodash')
const { models } = require('mongoose')
const { ServiceProvider } = models
const { ValidateCreateServiceProvider } = require('../Validation/Index')
const { createStripeServiceProvider, updateStripeServiceProvider } = require('./Stripe')
const { savePrimaryServiceCategories, getAddressFromPostCode } = require('./Common')

const createServiceProvider = async (res, req) => {
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
    const { results } = await getAddressFromPostCode(postal_code)
    latitude = results.latitude
    longitude = results.longitude
  }

  const address = { line1, line2, city, country, postal_code }

  //validate service provider
  const { isValid, errors } = ValidateCreateServiceProvider({
    name,
    business_type,
    headline,
    description,
    line1,
    line2,
    city,
    county,
    country,
    latitude,
    longitude,
    postal_code,
    primaryLocation,
  })

  if (!isValid) {
    const { output } = badRequest('Invalid Service Provider Input')
    return res.status(output.statusCode).json({ ...errors, output })
  }

  try {
    //create stripe account
    const stripeServiceProvider = await createStripeServiceProvider({
      email,
      business_type,
      description: `Anaka User ${id},`,
      name,
      address,
      phone,
    })

    const newServiceProvider = new ServiceProvider({
      user: id,
      name,
      type,
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

const updateServiceProvider = async (req, res) => {
  const { user, body, params } = req
  const { serviceProvider_id } = params
  const { email, id, name, phone } = user
  const { line1, line2, city, county, country, postal_code, primaryLocation } = body
  let { latitude, longitude } = body
  const serviceProvider = { line1, line2, city, county, country, postal_code, latitude, longitude, primaryLocation }
  const address = { line1, line2, city, country, postal_code }

  //GET LAT LONG
  if (!latitude || !longitude) {
    const { results } = await getAddressFromPostCode(postal_code)
    latitude = results.latitude
    longitude = results.longitude
  }

  //validate service provider
  const { isValid, errors } = ValidateCreateServiceProvider(serviceProvider)

  if (!isValid) {
    const { output } = badRequest('Invalid Service Provider Date')
    return res.status(output.statusCode).json({ ...errors, output })
  }

  try {
    const updateServiceProvider = await ServiceProvider.findById(serviceProvider_id)

    if (!serviceProvider) {
      const { output } = notFound('Service Providers not found')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    //create stripe account
    const stripeServiceProvider = await updateStripeServiceProvider(updateServiceProvider.stripeAccountId, {
      email,
      description: `Anaka Service provider ${id},`,
      name,
      address,
      phone,
    })

    if (!stripeServiceProvider) {
      const { output } = badRequest('Error updating service provider')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    //save updated serviceProvider
    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
      serviceProvider_id,
      { $set: { address, primaryLocation } },
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
