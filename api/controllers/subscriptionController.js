const { Account } = require('../models/Account');
const { Subscription } = require('../models/Subscription');

const { attachPaymentToCustomer, createSubscription } = require('../adaptors/stripeAdaptor');

const postSubscription = async (req, res) => {
  const { accountId, customerId, paymentMethodId, priceId } = req.body

  try {
    await attachPaymentToCustomer({ customerId, paymentMethodId });

    const stripeSubscription = await createSubscription({ customerId, priceId });

    const account = await Account.findByPk(accountId)

    const subscription = await Subscription.create({
      stripeSubscriptionId: stripeSubscription.id,
      currentPeriodEnd: stripeSubscription.current_period_end,
      stripeCustomerId: stripeSubscription.customer,
      stripePriceId: stripeSubscription.items.data[0].price.id
    });

    await subscription.setAccount(account);

    res.send(subscription.toJSON());
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  postSubscription
};
