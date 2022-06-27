const { getVerify } = require("../controllers/verifyController");
const { validateGetVerify } = require("../validations/verify");

module.exports = async (fastify) => {
  fastify.get("/verify", validateGetVerify, getVerify);
};
