const express = require('express')
const router = express.Router()
const { jwtAuth } = require('../../Middleware/Authentication')
const { isRootAdmin } = require('../../Middleware/Authorization')

const {
  getServiceCategory,
  createServiceCategory,
  getServiceCategoryList,
  updateServiceCategory,
} = require('../../Controller/ServiceCategory')

router.post('/create', [jwtAuth, isRootAdmin], createServiceCategory)

//GET SERVICE PROVIDERS
router.get('/list', [jwtAuth], getServiceCategoryList)

//GET SERVICE PROVIDER
router.get('/:id', [jwtAuth], getServiceCategory)

//UPDATE SERVICE PROVIDERS
router.post('/update', [jwtAuth, isRootAdmin], updateServiceCategory)
