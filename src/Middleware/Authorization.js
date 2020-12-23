const { unauthorized } = require('@hapi/boom')
const { models } = require('mongoose')
const { User } = models

module.exports = {
  isRootAdmin: async (req, res, next) => {
    const user = await User.findById(req.user.id).select('role')
    if (user && user.role === 'Admin') {
      return next()
    } else {
      const { output } = unauthorized()
      res.status(output.statusCode).json(output)
    }
  },
}
