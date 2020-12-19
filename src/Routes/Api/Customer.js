const express = require('express')
const router = express.Router()
const { CustomerController } = require('../../Controller/Index')
const { createCustomer, getCustomer, getCustomers, updateCustomer } = CustomerController

router.post('/create-customer', createCustomer)

router.get('/', getCustomer)

router.get('/list', getCustomers)

router.post('/:customer', updateCustomer)
