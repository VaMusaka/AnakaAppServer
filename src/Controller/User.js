const { badRequest, notFound } = require('@hapi/boom')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const { models } = require('mongoose')
const mailer = require('./Mailer')
const { ValidateUserRegister } = require('../Validation')

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

const tokeniseEmail = email => {
  const hash = crypto.createHash('sha512')
  hash.update(email)
  return `${hash.digest('hex')}`
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

  const verificationToken = email && tokeniseEmail(email)
  const baseUri = `${req.protocol}://${req.hostname}`

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
        emailVerification: { token: verificationToken },
      },
      { new: true }
    )

    if (!newUser) {
      const { output } = badRequest({ flash: 'Error creating account please try again' })
      res.status(output.statusCode).json(output)
    }
    //SEND VERIFICATION EMAIL
    const message = {
      to: email,
      subject: 'Please verify your email.',
      dynamic_template_data: {
        title: 'Please verify your email.',
        firstname,
        message: 'Your link is active for 48 hours. After that, you will need to resend the verification email. ',
        button_text: 'Verify',
        button_uri: `${baseUri}/users/verify/${verificationToken}`,
      },
    }
    await mailer(message)

    //RETURN SUCCESS
    res.json({ success: true })
  } catch (error) {
    const { output } = badRequest(error)
    res.status(output.statusCode).json(output)
  }
}

module.exports = {
  Register,
}
