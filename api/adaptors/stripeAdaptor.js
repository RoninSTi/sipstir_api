const attachPaymentToCustomer = async ({ customerId, paymentMethodId, stripe }) => {
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });

  return stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });
}

const createCustomer = async({ email, stripe }) => {
  const customer = await stripe.customers.create({
    email,
  });

  return customer;
};

const createSubscription = async ({ customerId, priceId, stripe }) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    expand: ['latest_invoice.payment_intent'],
  });

  return subscription
}

const deleteSubscription = async ({ subscriptionId, stripe }) => {
  const deleted = await stripe.subscriptions.del(subscriptionId)

  return deleted
}

const getPaymentMethod = async ({ paymentMethodId, stripe }) => {
  const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId)

  return paymentMethod
}

const getProducts = async ({ stripe }) => {
  const products = await stripe.products.list()

  return products
}

const getPrices = async ({ stripe }) => {
  const prices = await stripe.prices.list()

  return prices
}

module.exports = {
  attachPaymentToCustomer,
  createCustomer,
  createSubscription,
  deleteSubscription,
  getPaymentMethod,
  getPrices,
  getProducts
};
