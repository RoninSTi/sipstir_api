const { validateDeleteAccountMember, validatePostAccount, validatePostAccountMemberAdd } = require('../validations/account');
const { deleteAccountMember, postAccount, postAccountMemberAdd } = require('../controllers/accountController');

module.exports = async (fastify) => {
  fastify.delete('/account/:accountId/member/:memberId', validateDeleteAccountMember, deleteAccountMember);
  fastify.post('/account', validatePostAccount, postAccount);
  fastify.post('/account/:id/member/add', validatePostAccountMemberAdd, postAccountMemberAdd);
};
