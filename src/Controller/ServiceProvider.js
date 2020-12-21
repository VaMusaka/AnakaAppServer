const { badRequest, notFound } = require('@hapi/boom')
const { models } = require('mongoose')
const { User, ServiceProvider } = models
const { ValidateCreateServiceProvider } = require('../Validation/Index')
const { createStripeServiceProvider, updateStripeServiceProvider } = require('./Stripe')

const createServiceProvider = async (res, req) => {
  const { user, body } = req
  const { email, id, name, phone } = user
  const { line1, line2, city, county, country, postal_code, latitude, longitude, primaryLocation } = body
  const customer = { line1, line2, city, county, country, postal_code, latitude, longitude, primaryLocation }
  const address = { line1, line2, city, county, country, postal_code }

  //validate customer
  const { isValid, errors } = ValidateCreateServiceProvider(customer)

  if (!isValid) {
    const { output } = badRequest('Invalid Service Provider Input')
    return res.status(output.statusCode).json({ ...errors, output })
  }

  try {
    //create stripe account
    const stripeServiceProvider = await createStripeServiceProvider({
      email,
      description: `Anaka User ${id},`,
      name,
      address,
      phone,
    })

    //save customer and stripe account
    const newServiceProvider = new ServiceProvider({
      user: id,
      stripeAccountId: stripeServiceProvider.id,
      address,
      primaryLocation,
    })

    const savedServiceProvider = await newServiceProvider.save()

    if (!savedServiceProvider) {
      const { output } = badRequest('Error creating customer')
      return res.status(output.statusCode).json({ errors: { flash: output.payload.message }, output })
    }

    return res.json(savedServiceProvider)
  } catch (err) {
    const { output } = badRequest('Error creating customer')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

const getServiceProvider = async (req, res) => {
  const { id } = req.params
  try {
    const customer = await ServiceProvider.findById(id)
    if (!customer) {
      const { output } = notFound('Service Provider not found')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    res.json(customer)
  } catch (err) {
    const { output } = badRequest('Error getting customer')
    return res.status(output.statusCode).json({ ...err, flash: output.payload.message, output })
  }
}

const getServiceProviders = async (req, res) => {
  try {
    const customer = await ServiceProvider.find(id)
    if (!customer) {
      const { output } = notFound('Service Providers not found')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    res.json(customer)
  } catch (err) {
    const { output } = badRequest('Error getting customers')
    return res.status(output.statusCode).json({ ...err, flash: output.payload.message, output })
  }
}

const updateServiceProvider = async (req, res) => {
  const { user, body, params } = req
  const { customer_id } = params
  const { email, id, name, phone } = user
  const { line1, line2, city, county, country, postal_code, latitude, longitude, primaryLocation } = body
  const customer = { line1, line2, city, county, country, postal_code, latitude, longitude, primaryLocation }
  const address = { line1, line2, city, county, country, postal_code }

  //validate customer
  const { isValid, errors } = ValidateCreateServiceProvider(customer)

  if (!isValid) {
    const { output } = badRequest('Invalid Service Provider Date')
    return res.status(output.statusCode).json({ ...errors, output })
  }

  try {
    const updateServiceProvider = await ServiceProvider.findById(customer_id)

    if (!customer) {
      const { output } = notFound('Service Providers not found')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    //create stripe account
    const stripeServiceProvider = await updateStripeServiceProvider(updateServiceProvider.stripeAccountId, {
      email,
      description: `Anaka User ${id},`,
      name,
      address,
      phone,
    })

    //save updated customer
    const updatedServiceProvider = await ServiceProvider.findByIdAndUpdate(
      customer_id,
      { $set: { address, primaryLocation } },
      { $new: true }
    )

    if (!updatedServiceProvider) {
      const { output } = badRequest('Error updating customer')
      return res.status(output.statusCode).json({ errors: { flash: output.payload.message }, output })
    }

    return res.json(updatedServiceProvider)
  } catch (err) {
    const { output } = badRequest('Error updating customer')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

const customerServices = async (req, res) => {}

module.exports = {
  createServiceProvider,
  getServiceProvider,
  getServiceProviders,
  updateServiceProvider,
}
