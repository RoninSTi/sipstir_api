const { Member } = require('../db/db');

const getMemberAccounts = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findByPk(id);

    const accounts = await member.getAccounts({ include: [{ all: true, nested: true }] });

    res.send(accounts);
  } catch (error) {
    res.send(error)
  }
};

const postMember = async (req, res) => {
  const { email } = req.body;

  try {
    const [member] = await Member.findOrCreate({
      where: {
        email
      }
    });

    const permissions = JSON.stringify(req.user.permissions);

    if (permissions !== member.permissions) {
      member.permissions = permissions;

      await member.save();
    }

    const response = await Member.getSingle({ id: member.id } );

    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = {
  getMemberAccounts,
  postMember
};
