const {
  Account,
  AccountUser,
  Location,
  PaymentMethod,
  Subscription,
  User,
} = require("../db/db");
const nconf = require("nconf");

async function addUserToAccount({ accountId, email, mg, role }) {
  const [user, created] = await User.findOrCreate({
    where: {
      email,
    },
  });

  if (created) {
    await user.setDefaultAvatar();
  }

  await user.setOtp();

  const [accountUser] = await AccountUser.findOrCreate({
    where: {
      accountId,
      userId: user.id,
      role,
    },
  });

  const data = {
    from: "Sipstir Business <no-reply@sipstir.app>",
    to: email,
    subject: "Welcome to Sipstir Business",
    text: `Thank you for joining Sipstir Business.  Please verify your email and continue the setup process by following this link: ${nconf.get(
      "app.authCallbackHost"
    )}/verify?otp=${user.otp}`,
  };

  await mg.messages().send(data);

  return accountUser;
}

async function getAccounts(req, res) {
  const { page = 1, pageSize = 100 } = req.query;

  const offset = page * pageSize - pageSize;
  const limit = pageSize;

  try {
    const query = {
      include: [{ all: true, nested: true }],
      offset: offset,
      limit: limit,
      order: [["createdAt", "DESC"]],
    };

    const accounts = await Account.findAll({ ...query });

    const promises = accounts.map((account) => Account.getSingle(account.id));

    const response = await Promise.all(promises);

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

async function getPaymentMethod(req, res) {
  const { accountId } = req.params;

  try {
    const paymentMethod = await PaymentMethod.findOne({
      where: {
        accountId: accountId,
        isDefault: true,
      },
    });

    const response = paymentMethod ? paymentMethod.toJSON() : null;

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

async function getSubscription(req, res) {
  const { accountId } = req.params;

  try {
    const subscription = await Subscription.findOne({
      where: {
        accountId: accountId,
        isDeleted: false,
      },
    });

    const response = subscription ? subscription.toJSON() : null;

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

async function postAccount(req, res) {
  const { contactName, email, image, name, placeId, phone, url } = req.body;

  try {
    const account = await Account.create({
      contactName,
      email,
      image,
      name,
      phone,
      url,
    });

    const setupTasks = [
      addUserToAccount({
        accountId: account.id,
        email,
        mg: this.mg,
        role: "super-admin",
      }),
      account.createStripeAccount({ stripe: this.stripe }),
    ];

    await Promise.all(setupTasks);

    if (placeId) {
      const location = await Location.createLocationFromPlaceId(placeId);

      await account.setLocation(location);
    }

    res.send(account.toJSON());
  } catch (error) {
    res.send(error);
  }
}

async function putAccount(req, res) {
  const { accountId } = req.params;

  const updatedData = req.body;

  try {
    const account = await Account.findByPk(accountId);

    if (updatedData.email !== account.email) {
      await addUserToAccount({
        accountId,
        email: updatedData.email,
        role: "super-admin",
      });
    }

    Object.keys(updatedData).forEach((key) => {
      account[key] = updatedData[key];
    });

    await account.save();

    const response = await Account.getSingle(accountId);

    res.send(response);
  } catch (error) {
    res.send(error);
  }
}

const postAccountUserAdd = async (req, res) => {
  const { email, role } = req.body;
  const { accountId } = req.params;

  try {
    await addUserToAccount({ accountId, email, role });

    const response = await Account.getSingle(accountId);

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

const deleteAccount = async (req, res) => {
  const { accountId } = req.params;

  try {
    await Account.destroy({
      where: {
        id: accountId,
      },
    });

    res.send(200);
  } catch (error) {
    res.send(error);
  }
};

const deleteAccountUser = async (req, res) => {
  const { accountId, userId } = req.params;

  try {
    await AccountUser.destroy({
      where: {
        accountId,
        userId,
      },
    });

    const response = await Account.getSingle(accountId);

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

const putAccountUser = async (req, res) => {
  const { accountId, userId } = req.params;
  const { role } = req.body;

  try {
    const accountUser = await AccountUser.findOne({
      where: {
        accountId,
        userId,
      },
    });

    accountUser.role = role;

    await accountUser.save();

    const response = await Account.getSingle(accountId);

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  deleteAccount,
  deleteAccountUser,
  getAccounts,
  getPaymentMethod,
  getSubscription,
  postAccount,
  postAccountUserAdd,
  putAccount,
  putAccountUser,
};
