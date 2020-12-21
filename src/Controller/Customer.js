const { badRequest, notFound, notAllowed } = require('@hapi/boom')
const { models } = require('mongoose')
const { isEmpty } = require('lodash')
const { User, Customer } = models
const { ValidateCreateCustomer } = require('../Validation/Index')
const { createStripeCustomer, updateStripeCustomer } = require('./Stripe')

const createCustomer = async (req, res) => {
  if (isEmpty(req.body)) {
    const { output } = badRequest('Invalid Customer Input')
    return res.status(output.statusCode).json({ output })
  }
  const { user, body } = req
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
    //create stripe account
    const stripeCustomer = await createStripeCustomer({ email, description: `Anaka User ${id},`, name, address, phone })

    //save customer and stripe account
    const newCustomer = new Customer({ user: id, stripeCustomerId: stripeCustomer.id, address, primaryLocation })

    const savedCustomer = await newCustomer.save()

    if (!savedCustomer) {
      const { output } = badRequest('Error creating customer')
      return res.status(output.statusCode).json({ errors: { flash: output.payload.message }, output })
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

    //save updated customer
    const updatedCustomer = await Customer.findByIdAndUpdate(
      customer_id,
      { $set: { address, primaryLocation } },
      { $new: true }
    )

    if (!updatedCustomer) {
      const { output } = badRequest('Error updating customer')
      return res.status(output.statusCode).json({ errors: { flash: output.payload.message }, output })
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
  const { userId: id } = user

  if (isEmpty(primaryServiceCategories)) {
    const { output } = notAllowed('Please select service categories')
    return res.status(output.statusCode).json({ output })
  }

  ///GET CUSTOMER AND UPDATE
  try {
    const customer = await Customer.findOneAndUpdate(
      { user: id },
      { $set: { primaryServiceCategories } },
      { $new: true }
    )

    if (!customer) {
      const { output } = badRequest('Error updating primary services')
      return res.status(output.statusCode).json({ output })
    }

    res.json(customer)
  } catch (err) {
    const { output } = badRequest('Error updating primary services')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

module.exports = {
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  customerPrimaryServiceCategories,
}
