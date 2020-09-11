const { Account, PaymentMethod } = require('../db/db')
const { attachPaymentToCustomer, getPaymentMethod } = require('../adaptors/stripeAdaptor')

async function postPaymentMethod(req, res) {
  const { accountId, customerId, paymentMethodId } = req.body

  const { id: userId } = req.user

  try {
    await attachPaymentToCustomer({ customerId, paymentMethodId, stripe: this.stripe });

    await PaymentMethod.destroy({
      where: {
        accountId,
      }
    })

    const stripePaymentMethod = await getPaymentMethod({ paymentMethodId, stripe: this.stripe })

    const paymentMethod = await PaymentMethod.create({
      brand: stripePaymentMethod.card.brand,
      expMonth: stripePaymentMethod.card.exp_month,
      expYear: stripePaymentMethod.card.exp_year,
      isDefault: true,
      last4: stripePaymentMethod.card.last4,
      stripePaymentMethodId: paymentMethodId,
    })

    const account = await Account.findByPk(accountId)

    await paymentMethod.setAccount(account)

    const accountNotificationFeed = this.client.feed('account_notification', `${accountId}`)

    const subscriptionActivity = {
      actor: `${userId}`,
      verb: 'updated',
      object: `paymentMethod:${paymentMethod.id}`,
      message: `Updated payment method to ${paymentMethod.brand} ending in: ${paymentMethod.last4}`,
      time: new Date(),
    }

    await accountNotificationFeed.addActivity(subscriptionActivity)

    const response = paymentMethod.toJSON()

    res.send(response)
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  postPaymentMethod
}
