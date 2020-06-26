const nconf = require('nconf');
const STRIPE_KEY = nconf.get('keys.stripe.secret')

const stripe = require('stripe')(STRIPE_KEY, { apiVersion: '' });

const attachPaymentToCustomer = async ({ customerId, paymentMethodId }) => {
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  return stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
}

const createCustomer = async email => {
  const customer = await stripe.customers.create({
    email,
  });

  return customer;
};

const createSubscription = async ({ customerId, priceId }) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription
}

const getProducts = async () => {
  const products = await stripe.products.list()

  return products
}

const getPrices = async () => {
  const prices = await stripe.prices.list()

  return prices
}

module.exports = {
  attachPaymentToCustomer,
  createCustomer,
  createSubscription,
  getPrices,
  getProducts
};
