const { unauthorized } = require('@hapi/boom')
const { models } = require('mongoose')
const { User } = models

const isRootAdmin = async (req, res, next) => {
  console.log(req.user)
  // const user = await User.findById(req.user._id).select('role')

  // console.log(user)

  // if (user && user.role === 'Admin') {
  return next()
  // } else {
  //   const { output } = unauthorized()
  //   res.status(output.statusCode).json(output)
  // }
}

module.exports = { isRootAdmin }
