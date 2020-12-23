const { badRequest, notFound, notAllowed } = require('@hapi/boom')
const { models } = require('mongoose')
const { isEmpty } = require('lodash')
const { Customer } = models
const { ValidateCreateCustomer } = require('../Validation/Index')
const { createStripeCustomer, updateStripeCustomer } = require('./Stripe')
const { savePrimaryServiceCategories } = require('./Common')

const createCustomer = async (req, res) => {
  if (isEmpty(req.body)) {
    const { output } = badRequest('Invalid Customer Input')
    return res.status(output.statusCode).json({ output })
  }
  const { user, body } = req
  const { email, id, name, phone } = user
  const { line1, line2, city, county, country, postal_code, latitude, longitude, primaryLocation } = body
  const customer = { line1, line2, city, county, country, postal_code, latitude, longitude, primaryLocation }
  const address = { line1, line2, city, country, postal_code }

  //validate customer
  const { isValid, errors } = ValidateCreateCustomer(customer)

  if (!isValid) {
    const { output } = badRequest('Invalid Customer Input')
    return res.status(output.statusCode).json({ ...errors, output })
  }

  try {
    //create stripe account
    const stripeCustomer = await createStripeCustomer({ email, description: `Anaka User ${id},`, name, address, phone })

    //save customer and stripe account
    const newCustomer = new Customer({
      user: id,
      stripeCustomerId: stripeCustomer.id,
      address: { ...address, county, longitude, latitude },
      primaryLocation,
    })

    const savedCustomer = await newCustomer.save()

    if (!savedCustomer) {
      const { output } = badRequest('Error creating customer')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    return res.json(savedCustomer)
  } catch (err) {
    const { output } = badRequest('Error creating customer')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

const getCustomer = async (req, res) => {
  const { id } = req.params
  try {
    const customer = await Customer.findById(id)
    if (!customer) {
      const { output } = notFound('Customer not found')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    res.json(customer)
  } catch (err) {
    const { output } = badRequest('Error getting customer')
    return res.status(output.statusCode).json({ ...err, flash: output.payload.message, output })
  }
}

const getCustomers = async (req, res) => {
  try {
    const customer = await Customer.find(id)
    if (!customer) {
      const { output } = notFound('Customers not found')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    res.json(customer)
  } catch (err) {
    const { output } = badRequest('Error getting customers')
    return res.status(output.statusCode).json({ ...err, flash: output.payload.message, output })
  }
}

const updateCustomer = async (req, res) => {
  const { user, body, params } = req
  const { customer_id } = params
  const { email, id, name, phone } = user
  const { line1, line2, city, county, country, postal_code, latitude, longitude, primaryLocation } = body
  const customer = { line1, line2, city, county, country, postal_code, latitude, longitude, primaryLocation }
  const address = { line1, line2, city, county, country, postal_code }

  //validate customer
  const { isValid, errors } = ValidateCreateCustomer(customer)

  if (!isValid) {
    const { output } = badRequest('Invalid Customer Input')
    return res.status(output.statusCode).json({ ...errors, output })
  }

  try {
    const updateCustomer = await Customer.findById(customer_id)

    if (!customer) {
      const { output } = notFound('Customers not found')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    //create stripe account
    const stripeCustomer = await updateStripeCustomer(updateCustomer.stripeCustomerId, {
      email,
      description: `Anaka User ${id},`,
      name,
      address,
      phone,
    })

    if (!stripeCustomer) {
      const { output } = badRequest('Error updating customer')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    //save updated customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customer_id,
      { $set: { address, primaryLocation } },
      { $new: true }
    )

    if (!updatedCustomer) {
      const { output } = badRequest('Error updating customer')
      return res.status(output.statusCode).json({ flash: output.payload.message, output })
    }

    return res.json(updatedCustomer)
  } catch (err) {
    const { output } = badRequest('Error updating customer')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

const customerPrimaryServiceCategories = async (req, res) => {
  const { body, user } = req
  const { primaryServiceCategories } = body

  ///GET CUSTOMER AND UPDATE
  await savePrimaryServiceCategories(Customer, primaryServiceCategories, user, req, res)
}

module.exports = {
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  customerPrimaryServiceCategories,
}
