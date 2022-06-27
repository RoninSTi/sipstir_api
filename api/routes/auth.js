const {
  validatePostAuthApple,
  validatePostAuthFacebook,
  validatePostLogin,
  validatePostPasswordReset,
  validatePostRegister,
} = require("../validations/auth");
const {
  getAuthSwoopCallback,
  postAuthApple,
  postAuthFacebook,
  postLogin,
  postRegister,
} = require("../controllers/authController");

module.exports = async (fastify) => {
  fastify.get("/auth/swoop/callback", getAuthSwoopCallback);
  fastify.post("/auth/apple", validatePostAuthApple, postAuthApple);
  fastify.post("/auth/facebook", validatePostAuthFacebook, postAuthFacebook);
  fastify.post("/auth/login", validatePostLogin, postLogin);
  fastify.post("/auth/register", validatePostRegister, postRegister);
  fastify.post(
    "/auth/password/reset",
    validatePostPasswordReset,
    postPasswordReset
  );
};
