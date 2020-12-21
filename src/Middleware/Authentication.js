const jwt = require('jsonwebtoken')
const passport = require('passport')
module.exports = {
  authentication: (req, res, next) => {
    const authHeaders = req.get('Authorization')
    if (!authHeaders) {
      req.isAuthenticated = false
      return next()
    }

    const token = authHeaders.split(' ')[1]
    if (!token || token === '') {
      req.isAuthenticated = false
      return next()
    }

    let decodedToken
    try {
      decodedToken = jwt(verify, process.env.AUTH_SECRET)
    } catch (error) {
      req.isAuthenticated = false
      return next()
    }

    if (!decodedToken) {
      req.isAuthenticated = false
      return next()
    }

    req.isAuthenticated = true
    req.user = decodedToken
    next()
  },
  jwtAuth: passport.authenticate('jwt', { session: false }),
}
