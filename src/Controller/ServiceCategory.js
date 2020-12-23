const { badRequest, notFound } = require('@hapi/boom')
const { isEmpty } = require('lodash')
const { models } = require('mongoose')
const { ServiceCategory } = models
const { ValidateServiceCategory } = require('../Validation/Index')

// CREATE SERVICE CATEGORY
const createServiceCategory = async (req, res) => {
  const { name, parent, description, active, featured } = req.body
  const { isValid, errors } = ValidateServiceCategory({ name, description })

  if (!isValid) {
    const { output } = badRequest('Invalid service category input')
    return res.status(output.statusCode).json({ ...errors, output })
  }

  try {
    const serviceCategory = new ServiceCategory({ name, parent, description, active, featured })
    const savedServiceCategory = await serviceCategory.save()

    if (!savedServiceCategory) {
      const { output } = badRequest('Error creating service category')
      return res.status(output.statusCode).json(output)
    }

    return res.json(savedServiceCategory)
  } catch (err) {
    const { output } = badRequest('Error creating service category')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

// UPDATE SERVICE CATEGORY
const updateServiceCategory = async (req, res) => {
  const { id } = req.params
  const { name, parent, description, active, featured } = req.body
  const { isValid, errors } = ValidateServiceCategory({ name, description })

  if (!isValid) {
    const { output } = badRequest('Invalid service category input')
    return res.status(output.statusCode).json({ ...errors, output })
  }

  try {
    const updatedServiceCategory = await ServiceCategory.findByIdAndUpdate(
      id,
      { $set: { name, parent, description, active, featured } },
      { $new: true }
    )

    if (!updatedServiceCategory) {
      const { output } = badRequest('Error updating service category')
      return res.status(output.statusCode).json(output)
    }

    return res.json(updatedServiceCategory)
  } catch (err) {
    const { output } = badRequest('Error updating service category')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

// GET SERVICE CATEGORY
const getServiceCategory = async (req, res) => {
  const { id } = req.params

  try {
    const serviceCategory = await ServiceCategory.findById(id)
    if (!serviceCategory) {
      const { output } = notFound()
      return res.status(output.statusCode).json(output)
    }

    res.json(serviceCategory)
  } catch (err) {
    const { output } = badRequest('Error creating service category')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

// LIST SERVICE CATEGORIES
const getServiceCategoryList = async (req, res) => {
  try {
    const serviceCategory = await ServiceCategory.find()
    if (isEmpty(serviceCategory)) {
      const { output } = notFound()
      return res.status(output.statusCode).json(output)
    }

    res.json(serviceCategory)
  } catch (err) {
    const { output } = badRequest('Error creating service category')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

module.exports = {
  createServiceCategory,
  updateServiceCategory,
  getServiceCategory,
  getServiceCategoryList,
}
