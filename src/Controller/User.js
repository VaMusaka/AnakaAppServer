const { badRequest, badImplementation } = require('@hapi/boom')
const bcrypt = require('bcryptjs')
const mailer = require('./Mailer')
const { models } = require('mongoose')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode')
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
    const { output } = badRequest()
    return res.status(output.statusCode).json(errors)
  }

  const verificationToken = CodeGenerator(1000, 9999)

  //CHECK USER EXISTS
  if (await getUserByEmail(email)) {
    const { output } = badRequest()
    return res.status(output.statusCode).json({ email: 'Email address already taken please login' })
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
      const { output } = badRequest('Error creating account please try again')
      res.status(output.statusCode).json(output)
    }

    //SEND VERIFICATION EMAIL
    const message = VerifyEmailTemplate(user)
    await mailer(message)

    //RETURN SUCCESS
    res.json({ success: true })
  } catch (error) {
    const { output } = badRequest()
    res.status(output.statusCode).json(error)
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
    return res.status(output.statusCode).json(errors)
  }

  //CHECK USER EXISTS
  const user = await getUserByEmail(email)
  if (!user) {
    const { output } = badRequest()
    return res.status(output.statusCode).json({
      email: generalAuthError,
      password: generalAuthError,
    })
  }

  if (!user.emailVerified) {
    console.log(user.emailVerified)
    const { output } = badRequest()

    return res.json({
      verifyEmail: true,
      email: 'This email address still needs verification ',
    })
  }

  //CHECK PASSWORDS MATCH
  const passwordIsMatch = await checkPassword(password, user.password)
  if (!passwordIsMatch) {
    const { output } = badRequest()

    console.log('output')
    return res.status(output.statusCode).json({
      email: generalAuthError,
      password: generalAuthError,
    })
  }

  //GENERATE AUTHENTICATION TOKEN
  const token = await generateAuthToken(user)
  if (!token) {
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
    return res.status(output.statusCode).json(errors)
  }

  //COMPLETE VALIDATION AND UPDATE USER
  try {
    const user = await User.findOneAndUpdate(
      { email: RegExEmail(email), emailVerification: { token: emailVerificationToken } },
      { $set: { emailVerified: true } },
      { new: true }
    )

    if (!user) {
      const { output } = badRequest('Email verification failed')
      return res.status(output.statusCode).json(output.payload.message)
    }

    // SEND WELCOME EMAIL
    const message = WelcomeEmailTemplate(user)
    await mailer(message)

    res.json({ success: true })
  } catch (err) {
    const { output } = badImplementation()
    res.status(output.statusCode).json(err)
  }
}

const SendEmailVerificationCode = async (req, res) => {
  const { email } = req.body

  //SEND VERIFICATION EMAIL
  const user = await getUserByEmail(email)
  if (user) {
    const message = VerifyEmailTemplate(user)
    await mailer(message)
  }

  res.json({ success: true })
}

const ResetPasswordRequest = async (req, res) => {
  const { email } = req.body
  const { isValid, errors } = ValidateResetPasswordRequest({ email })

  //EMAIL IS VALID
  if (!isValid) {
    const { output } = badRequest()
    return res.status(output.statusCode).json(errors)
  }

  //COMPLETE GET USER, SET PASSWORD RESET TOKEN
  try {
    const passcode = CodeGenerator(100000, 999999)
    const user = await User.findOneAndUpdate(
      { email: RegExEmail(email) },
      { $set: { changePassword: { passcode, date: moment() } } },
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
  const { passcode, email, password, confirm_password } = req.body
  const request = { passcode, email, password, confirm_password }
  const { isValid, errors } = ValidateResetPassword(request)

  //ERRORS IN REQUEST
  if (!isValid) {
    const { output } = badRequest()
    return res.status(output.statusCode).json(errors)
  }

  try {
    //GET USER
    const user = await User.findOne({ email: RegExEmail(email) })

    if (!user) {
      const { output } = badRequest()
      return res.status(output.statusCode).json({ passcode: 'Invalid Passcode' })
    }

    if (user.changePassword.passcode !== passcode) {
      const { output } = badRequest()
      return res.status(output.statusCode).json({ passcode: 'Invalid Passcode' })
    }

    //CHECK TOKEN EXPIRY
    const twoHoursAgo = moment().subtract(2, 'hours')
    const isExpired = !moment(user.changePassword.date).isAfter(twoHoursAgo)

    if (isExpired) {
      console.log('Passcode expired')
      const { output } = badRequest()
      return res.status(output.statusCode).json({ passcode: 'Invalid Passcode' })
    }

    user.changePassword.passcode = null
    user.changePassword.date = null
    user.password = generatePasswordHash(password)

    await user.save()
    res.json('success')
  } catch (err) {
    const { output } = badRequest()
    return res.status(output.statusCode).json(err)
  }
}

module.exports = {
  Register,
  Login,
  VerifyEmail,
  ResetPasswordRequest,
  SendEmailVerificationCode,
  ResetPassword,
}
