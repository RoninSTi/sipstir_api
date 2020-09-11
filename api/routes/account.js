const {
  validateDeleteAccount,
  validateDeleteAccountUser,
  validateGetAccounts,
  validateGetPaymentMethod,
  validateGetSubscription,
  validatePostAccount,
  validatePostAccountUserAdd,
  validatePutAccount,
  validatePutAccountUser
} = require('../validations/account');

const {
  deleteAccount,
  deleteAccountUser,
  getAccounts,
  getPaymentMethod,
  getSubscription,
  postAccount,
  postAccountUserAdd,
  putAccount,
  putAccountUser
} = require('../controllers/accountController');

module.exports = async (fastify) => {
  fastify.delete('/account/:accountId', validateDeleteAccount, deleteAccount)
  fastify.delete('/account/:accountId/user/:userId', validateDeleteAccountUser, deleteAccountUser);
  fastify.get('/accounts', validateGetAccounts, getAccounts);
  fastify.get('/account/:accountId/subscription', validateGetSubscription, getSubscription)
  fastify.get('/account/:accountId/payment-method', validateGetPaymentMethod, getPaymentMethod)
  fastify.post('/account', validatePostAccount, postAccount);
  fastify.post('/account/:accountId/user/add', validatePostAccountUserAdd, postAccountUserAdd);
  fastify.put('/account/:accountId', validatePutAccount, putAccount);
  fastify.put('/account/:accountId/user/:userId', validatePutAccountUser, putAccountUser);
};
