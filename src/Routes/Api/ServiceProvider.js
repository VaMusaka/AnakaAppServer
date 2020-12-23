const express = require('express')
const router = express.Router()
const { getAddressFromPostCode } = require('../../Controller/Common')
const { jwtAuth } = require('../../Middleware/Authentication')
const {
  getServiceProvider,
  createServiceProvider,
  getServiceProviders,
  updateServiceProvider,
  serviceProviderPrimaryServiceCategories,
} = require('../../Controller/ServiceProvider')

//CREATE SERVICE PROVIDER
router.post('/create', [jwtAuth], createServiceProvider)

//GET SERVICE PROVIDERS
router.get('/list', [jwtAuth], getServiceProviders)

//GET SERVICE PROVIDER
router.get('/:id', [jwtAuth], getServiceProvider)

//UPDATE SERVICE PROVIDERS
router.post('/update', [jwtAuth], updateServiceProvider)

//SET SERVICE PROVIDER PRIMARY SERVICE CATEGORIES
router.post('/primary-service-categories', [jwtAuth], serviceProviderPrimaryServiceCategories)

///////
router.get('/postcode/:postcode', async (req, res) => {
  const address = await getAddressFromPostCode(req.params.postcode)
  res.json(address)
})

module.exports = router
