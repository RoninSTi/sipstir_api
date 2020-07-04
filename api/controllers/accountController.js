const { Account, AccountMember, Location, Member } = require('../db/db');

const createMembers = async members => {
  const memberIds = members.map( async m => {
    const [member] = await Member.findOrCreate({
      where: {
        email: m.email,
      }
    });

    return {
      id: member.id,
      role: m.role
    };
  });

  return Promise.all(memberIds);
}

const addMembersToAccount = async ({ accountId, members }) => {
  const addedMembers = await createMembers(members);

  const accountMembers = addedMembers.map(member => AccountMember.findOrCreate({
    where: {
      accountId,
      memberId: member.id,
      role: member.role
    }
  }));

  return Promise.all(accountMembers);
}

const postAccount = async (req, res) => {
  const { email, members, name, placeId } = req.body;

  try {
    const account = await Account.create({
      email,
      name
    });

    const setupTasks = [
      addMembersToAccount({ accountId: account.id, members }),
      account.createStripeAccount()
    ];

    await Promise.all(setupTasks);

    if (placeId) {
      const location = await Location.createLocationFromPlaceId(placeId);

      await account.setLocation(location)
    }

    res.send(account.toJSON());
  } catch (error) {
    res.send(error);
  }
};

const postAccountMemberAdd = async (req, res) => {
  const { email, role } = req.body;
  const { id } = req.params;

  try {
    const account = await Account.findByPk(id)

    const member = await Member.create({ email })

    await AccountMember.create({
      accountId: account.id,
      memberId: member.id,
      role,
    })

    const response = await Account.getSingle(account.id);

    res.send(response);
  } catch (error) {
    res.send(error)
  }
}

const deleteAccountMember = async (req, res) => {
  const { accountId, memberId } = req.params;

  try {
    await AccountMember.destroy({
      where: {
        accountId,
        memberId
      }
    });

    const response = await Account.getSingle(accountId);

    res.send(response);
  } catch (error) {
    res.send(error)
  }
}

const putAccountMember = async (req, res) => {
  const { accountId, memberId } = req.params;
  const { role } = req.body

  try {
    const accountMember = await AccountMember.findOne({
      where: {
        accountId,
        memberId
      }
    });

    accountMember.role = role;

    await accountMember.save()

    const response = await Account.getSingle(accountId);

    res.send(response)
  } catch (error) {
    res.send(error)
  }
}

module.exports = {
  deleteAccountMember,
  postAccount,
  postAccountMemberAdd,
  putAccountMember
};
