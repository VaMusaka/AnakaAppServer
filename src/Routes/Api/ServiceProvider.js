const express = require('express')
const router = express.Router()
const { getAddressFromPostCode } = require('../../Controller/Common')

router.get('/postcode/:postcode', async (req, res) => {
  const address = await getAddressFromPostCode(req.params.postcode)
  res.json(address)
})

module.exports = router
