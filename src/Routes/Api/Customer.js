const express = require('express')
const router = express.Router()
const { CustomerController } = require('../../Controller/Index')
const { jwtAuth } = require('../../Middleware/Authentication')
const {
  createCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
  customerPrimaryServiceCategories,
} = CustomerController

router.post('/create', [jwtAuth], createCustomer)

router.get('/', [jwtAuth], getCustomer)

router.get('/list', [jwtAuth], getCustomers)

router.post('/:customer', [jwtAuth], updateCustomer)

router.post('/service-categories', [jwtAuth], customerPrimaryServiceCategories)

module.exports = router
