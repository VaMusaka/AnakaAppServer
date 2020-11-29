const { badRequest, badImplementation } = require('@hapi/boom')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const mailer = require('./Mailer')
const { models } = require('mongoose')
const { VerifyEmailTemplate, WelcomeEmailTemplate, PasswordResetEmailTemplate } = require('../Utils/EmailTemplates')
const { CodeGenerator, RegExEmail } = require('../Utils/Helper')
const {
  ValidateUserRegister,
  ValidateUserLogin,
  ValidateEmailVerification,
  ValidateResetPasswordRequest,
  ValidateResetPassword,
} = require('../Validation/Index')
const moment = require('moment')
const { AUTH_VALID_PERIOD, AUTH_SECRET } = process.env

const { User } = models

const getUserByEmail = async email => {
  return await User.findOne({ email })
}

const saveUser = async user => {
  try {
    const newUser = new User(user)
    return await newUser.save()
  } catch (error) {
    throw new Error(error)
  }
}

const generatePasswordHash = password => {
  const saltRound = 12
  const salt = bcrypt.genSaltSync(saltRound)
  const hash = bcrypt.hashSync(password, salt)
  return hash
}

const checkPassword = async (input, password) => {
  try {
    return await bcrypt.compare(input, password)
  } catch (err) {
    throw err
  }
}

const generateAuthToken = async user => {
  const payload = { id: user._id, email: user.email }
  try {
    const token = await jwt.sign(payload, AUTH_SECRET, { expiresIn: AUTH_VALID_PERIOD })
    return `Bearer ${token}`
  } catch (err) {
    throw err
  }
}

const Register = async (req, res) => {
  const { firstname, lastname, email, password, confirm_password, type } = req.body
  const data = { firstname, lastname, email, password, confirm_password, type }

  //VALIDATE USER
  const { isValid, errors } = ValidateUserRegister(data)

  //INPUT HAS ERRORS
  if (!isValid) {
    const { output } = badRequest(errors)
    return res.status(output.statusCode).json(output)
  }

  const verificationToken = CodeGenerator(1000, 9999)

  //CHECK USER EXISTS
  if (await getUserByEmail(email)) {
    const { output } = badRequest({ email: 'Email address already taken please login' })
    return res.status(output.statusCode).json(output)
  }

  try {
    //CREATE AND SAVE NEW USER
    const newUser = await saveUser(
      {
        firstname,
        lastname,
        email,
        active: true,
        type,
        emailVerified: false,
        password: generatePasswordHash(password),
        emailVerification: { token: verificationToken, date: moment() },
      },
      { new: true }
    )

    if (!newUser) {
      const { output } = badRequest({ flash: 'Error creating account please try again' })
      res.status(output.statusCode).json(output)
    }
    //SEND VERIFICATION EMAIL
    const message = VerifyEmailTemplate(user)
    await mailer(message)

    //RETURN SUCCESS
    res.json({ success: true })
  } catch (error) {
    const { output } = badRequest(error)
    res.status(output.statusCode).json(output)
  }
}

const Login = async (req, res) => {
  const { email, password } = req.body
  const data = { email, password }
  const generalAuthError = 'Invalid email address or password.'

  //VALIDATE LOGIN DETAILS
  const { isValid, errors } = ValidateUserLogin(data)

  //INPUT HAS ERRORS
  if (!isValid) {
    const { output } = badRequest(errors)
    return res.status(output.statusCode).json(output)
  }

  //CHECK USER EXISTS
  const user = await getUserByEmail(email)
  if (!user) {
    const { output } = badRequest({
      email: generalAuthError,
      password: generalAuthError,
    })
    return res.status(output.statusCode).json(output)
  }

  if (!user.emailVerified) {
    const { output } = badRequest({
      emailVerified: true,
      email: 'This email address still needs verification ',
    })
    return res.status(output.statusCode).json(output)
  }

  //CHECK PASSWORDS MATCH
  const passwordIsMatch = await checkPassword(password, user.password)
  if (!passwordIsMatch) {
    const { output } = badRequest({
      email: generalAuthError,
      password: generalAuthError,
    })
    return res.status(output.statusCode).json(output)
  }

  //GENERATE AUTHENTICATION TOKEN
  const token = await generateAuthToken(user)
  if (!auth) {
    const { output } = badImplementation('Failed to authenticate')
    return res.status(output.statusCode).json(output)
  }

  res.json({ success: true, token: token })
}

const VerifyEmail = async (req, res) => {
  const { email, emailVerificationToken } = req.body
  const data = { email, emailVerificationToken }
  const { isValid, errors } = ValidateEmailVerification(data)

  // VALIDATION ERRORS
  if (!isValid) {
    const { output } = badRequest(errors)
    return res.status(output.statusCode).json(output)
  }

  //COMPLETE VALIDATION AND UPDATE USER
  try {
    const user = await User.findOneAndUpdate(
      { email: RegExEmail(email), emailVerificationToken },
      { $set: { emailVerified: true } },
      { new: true }
    )
    // SEND WELCOME EMAIL
    const message = WelcomeEmailTemplate(user)
    await mailer(message)

    res.json(user)
  } catch (err) {
    const { output } = badImplementation(err)
    res.status(output.statusCode).json(output)
  }
}

const ResetPasswordRequest = async (req, res) => {
  const { email } = req.body
  const { isValid, errors } = ValidateResetPasswordRequest({ email })

  //EMAIL IS VALID
  if (!isValid) {
    const { output } = badRequest(errors)
    return res.status(output.statusCode).json(output)
  }

  //COMPLETE GET USER, SET PASSWORD RESET TOKEN
  try {
    const token = CodeGenerator(1000, 9999)
    const user = await User.findOneAndUpdate(
      { email: RegExEmail(email) },
      { $set: { changePassword: { token, date: moment() } } },
      { new: true }
    )
    // SEND WELCOME EMAIL
    const message = PasswordResetEmailTemplate(user)
    await mailer(message)

    res.json('Success')
  } catch (err) {
    console.log(err)
    // FOR SECURITY REASONS ONLY RETURN SUCCESS,
    res.json('Success')
  }
}

const ResetPassword = async (req, res) => {
  const { token, email, password, confirm_password } = req.body
  const request = { token, email, password, confirm_password }
  const { isValid, errors } = ValidateResetPassword(request)

  //ERRORS IN REQUEST
  if (!isValid) {
    const { output } = badRequest(errors)
    console.log(errors)
    return res.status(output.statusCode).json(output)
  }

  try {
    //GET USER
    const user = await User.findOne({ email: RegExEmail(email) })

    if (!user) {
      const { output } = badRequest({ token: 'Invalid Token' })
      return res.status(output.statusCode).json(output)
    }

    if (user.changePassword.token !== token) {
      const { output } = badRequest({ token: 'Invalid Token' })
      return res.status(output.statusCode).json(output)
    }

    //CHECK TOKEN EXPIRY
    const twoHoursAgo = moment().subtract(2, 'hours')
    const isExpired = !moment(user.changePassword.date).isAfter(twoHoursAgo)

    if (isExpired) {
      console.log('token expired')
      const { output } = badRequest({ token: 'Invalid Token' })
      return res.status(output.statusCode).json(output)
    }

    user.changePassword.token = null
    user.changePassword.date = null
    user.password = generatePasswordHash(password)

    await user.save()
    res.json('success')
  } catch (e) {
    const { output } = badRequest(e)
    return res.status(output.statusCode).json(output)
  }
}

module.exports = {
  Register,
  Login,
  VerifyEmail,
  ResetPasswordRequest,
  ResetPassword,
}
