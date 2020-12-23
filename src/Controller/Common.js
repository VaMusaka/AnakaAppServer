const { notAllowed, badRequest } = require('@hapi/boom')
const { isEmpty } = require('lodash')
const axios = require('axios')

const savePrimaryServiceCategories = async (Model, primaryServiceCategories, user, req, res) => {
  if (isEmpty(primaryServiceCategories)) {
    const { output } = notAllowed('Please select service categories')
    return res.status(output.statusCode).json({ output })
  }

  ///GET CUSTOMER/SERVICE_PROVIDER AND UPDATE
  try {
    const updated = await Model.findOneAndUpdate(
      { user: user.id },
      { $set: { primaryServiceCategories } },
      { $new: true }
    )

    if (!updated) {
      const { output } = badRequest('Error updating primary services')
      return res.status(output.statusCode).json({ output })
    }

    res.json(updated)
  } catch (err) {
    const { output } = badRequest('Error updating primary services')
    return res.status(output.statusCode).json({ ...err, output })
  }
}

const getAddressFromPostCode = async postcode => {
  var config = {
    method: 'get',
    url: `https://api.postcodes.io/postcodes/${postcode}`,
  }

  try {
    const { data } = await axios(config)
    return data
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = {
  savePrimaryServiceCategories,
  getAddressFromPostCode,
}
