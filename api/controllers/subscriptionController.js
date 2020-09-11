const { Account, PaymentMethod, Subscription } = require('../db/db');

const {
  attachPaymentToCustomer,
  createSubscription,
  deleteSubscription: stripeDeleteSubscription,
  getPaymentMethod
} = require('../adaptors/stripeAdaptor');

async function deleteSubscription(req, res) {
  const { subscriptionId } = req.params

  const { id: userId } = req.user

  try {
    const subscription = await Subscription.findByPk(subscriptionId)

    subscription.isDeleted = true

    await subscription.save()

    await stripeDeleteSubscription({ subscriptionId: subscription.stripeSubscriptionId, stripe: this.stripe })

    const account = await Account.findByPk(subscription.accountId)

    account.isActive = false

    await account.save()

    await PaymentMethod.destroy({
      where: {
        accountId: account.id
      }
    })

    const accountNotificationFeed = this.client.feed('account_notification', `${account.id}`)

    const subscriptionActivity = {
      actor: `${userId}`,
      verb: 'cancel',
      object: `subscription:${subscription.id}`,
      message: 'Cancelled plan',
      time: new Date(),
    }

    await accountNotificationFeed.addActivity(subscriptionActivity)

    res.send(200)
  } catch (error) {
    res.send(error)
  }
}

async function postSubscription(req, res) {
  const { accountId, customerId, paymentMethodId, priceId } = req.body

  const { id: userId } = req.user

  try {
    const account = await Account.findByPk(accountId)

    await attachPaymentToCustomer({ customerId, paymentMethodId, stripe: this.stripe });

    const stripePaymentMethod = await getPaymentMethod({ paymentMethodId, stripe: this.stripe })

    const paymentMethod = await PaymentMethod.create({
      brand: stripePaymentMethod.card.brand,
      expMonth: stripePaymentMethod.card.exp_month,
      expYear: stripePaymentMethod.card.exp_year,
      isDefault: true,
      last4: stripePaymentMethod.card.last4,
      stripePaymentMethodId: paymentMethodId,
    })

    await paymentMethod.setAccount(account)

    const stripeSubscription = await createSubscription({ customerId, priceId, stripe: this.stripe });

    const subscription = await Subscription.create({
      stripeSubscriptionId: stripeSubscription.id,
      currentPeriodEnd: stripeSubscription.current_period_end,
      stripeCustomerId: stripeSubscription.customer,
      stripePriceId: stripeSubscription.items.data[0].price.id
    });

    await subscription.setAccount(account);

    account.isActive = true;

    await account.save();

    const accountNotificationFeed = this.client.feed('account_notification', `${accountId}`)

    const subscriptionActivity = {
      actor: `${userId}`,
      verb: 'subscribe',
      object: `subscription:${subscription.id}`,
      message: 'Started plan',
      time: new Date(),
    }

    await accountNotificationFeed.addActivity(subscriptionActivity)

    res.send(subscription.toJSON());
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  deleteSubscription,
  postSubscription
};
