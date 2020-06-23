const { Account } = require('../models/Account');
const { AccountMember } = require('../models/AccountMember');
const { Location } = require('../models/Location');
const { Member } = require('../models/Member');

const createMemberIds = async members => {
  const memberIds = members.map( async email => {
    const [member] = await Member.findOrCreate({
      where: {
        email,
      }
    });

    return member.id
  });

  return Promise.all(memberIds);
}

const addMembersToAccount = async ({ accountId, members }) => {
  const memberIds = await createMemberIds(members);

  console.log({ memberIds })

  const accountMembers = memberIds.map(memberId => AccountMember.findOrCreate({
    where: {
      accountId,
      memberId,
    }
  }));

  return Promise.all(accountMembers);
}

const postAccount = async (req, res) => {
  const { members, name, placeId } = req.body;

  try {
    const account = await Account.create({
      name
    });

    await addMembersToAccount({ accountId: account.id, members });


    if (placeId) {
      const location = await Location.createLocationFromPlaceId(placeId);

      account.locationId = location.id

      await account.save();
    }

    res.send(account.toJSON());
  } catch (error) {
    res.send(error);
  }
};

const postAccountMemberAdd = async (req, res) => {
  const { members } = req.body;
  const { id } = req.params;

  try {
    const account = await Account.findByPk(id)

    if (!account) {
      res.send(new Error('Account does not exist.'))
    }

    await addMembersToAccount({ accountId: account.id, members });

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

module.exports = {
  deleteAccountMember,
  postAccount,
  postAccountMemberAdd
};
