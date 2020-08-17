const {
  validateDeleteAccount,
  validateDeleteAccountUser,
  validateGetAccounts,
  validatePostAccount,
  validatePostAccountUserAdd,
  validatePutAccountUser
} = require('../validations/account');

const {
  deleteAccount,
  deleteAccountUser,
  getAccounts,
  postAccount,
  postAccountUserAdd,
  putAccountUser
} = require('../controllers/accountController');

module.exports = async (fastify) => {
  fastify.delete('/account/:accountId', validateDeleteAccount, deleteAccount)
  fastify.delete('/account/:accountId/user/:userId', validateDeleteAccountUser, deleteAccountUser);
  fastify.get('/accounts', validateGetAccounts, getAccounts)
  fastify.post('/account', validatePostAccount, postAccount);
  fastify.post('/account/:accountId/user/add', validatePostAccountUserAdd, postAccountUserAdd);
  fastify.put('/account/:accountId/user/:userId', validatePutAccountUser, putAccountUser)
};
