const sendgrid = require('@sendgrid/mail')
const { SENDGRID_API_KEY, EMAIL_SENDER, EMAIL_TEMPLATE } = process.env

sendgrid.setApiKey(SENDGRID_API_KEY)

module.exports = async message => {
  // console.log({ ...message, from: EMAIL_SENDER, templateId: EMAIL_TEMPLATE })
  return await sendgrid.send({ ...message, from: EMAIL_SENDER, templateId: EMAIL_TEMPLATE })
}
