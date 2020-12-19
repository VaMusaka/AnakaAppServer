const Stripe = require('stripe')
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY)

const createStripeCustomer = async customer => {
  return await stripe.customers.create(customer)
}

const updateStripeCustomer = async (id, customer) => {
  return await stripe.customers.update(id, customer)
}

const getStripeCustomer = async id => {
  return await stripe.customers.retrieve(id)
}

//////================SERVICE PROVIDER=================/////
const createStripeAccount = async account => {
  return await stripe.accounts.create(account)
}

const updateStripeAccount = async (id, account) => {
  return await stripe.accounts.update(id, account)
}

module.exports = {
  createStripeCustomer,
  updateStripeCustomer,
  getStripeCustomer,
}
