const { validateDeleteAccountMember, validatePostAccount, validatePostAccountMemberAdd, validatePutAccountMember } = require('../validations/account');
const { deleteAccountMember, postAccount, postAccountMemberAdd, putAccountMember } = require('../controllers/accountController');

module.exports = async (fastify) => {
  fastify.delete('/account/:accountId/member/:memberId', validateDeleteAccountMember, deleteAccountMember);
  fastify.post('/account', validatePostAccount, postAccount);
  fastify.post('/account/:id/member/add', validatePostAccountMemberAdd, postAccountMemberAdd);
  fastify.put('/account/:accountId/member/:memberId', validatePutAccountMember, putAccountMember)
};
