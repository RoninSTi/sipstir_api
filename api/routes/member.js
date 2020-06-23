const { validateGetMemberAccounts, validatePostMember } = require('../validations/member');
const { getMemberAccounts, postMember } = require('../controllers/memberController');

module.exports = async (fastify) => {
  fastify.get('/member/:id/accounts', validateGetMemberAccounts, getMemberAccounts);
  fastify.post('/member', validatePostMember, postMember);
};
