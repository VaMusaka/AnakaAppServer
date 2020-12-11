const { badRequest, badImplementation } = require('@hapi/boom')
const { models } = require('mongoose')
const { User, Customer } = models

const createCustomer = (res, req) => {
  //validate customer
  //create stripe account
  //save customer and stripe account
}

const getCustomer = (req, res) => {}

const getCustomers = (req, res) => {}

const updateCustomer = (req, res) => {}

module.exports = {
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
}
