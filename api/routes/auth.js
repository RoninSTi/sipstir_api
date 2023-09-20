const {
  validatePostAuthApple,
  validatePostAuthFacebook,
  validatePostForgot,
  validatePostLogin,
  validatePostLogout,
  validatePostPasswordReset,
  validatePostRegister,
} = require("../validations/auth");
const {
  postAuthApple,
  postAuthFacebook,
  postForgot,
  postLogin,
  postLogout,
  postPasswordReset,
  postRefresh,
  postRegister,
} = require("../controllers/authController");

module.exports = async (fastify) => {
  fastify.post("/auth/apple", validatePostAuthApple, postAuthApple);
  fastify.post("/auth/facebook", validatePostAuthFacebook, postAuthFacebook);
  fastify.post("/auth/forgot", validatePostForgot, postForgot);
  fastify.post("/auth/login", validatePostLogin, postLogin);
  fastify.post("/auth/logout", validatePostLogout, postLogout);
  fastify.post("/auth/register", validatePostRegister, postRegister);
  fastify.post(
    "/auth/password/reset",
    validatePostPasswordReset,
    postPasswordReset
  );
  fastify.post("/auth/refresh", postRefresh);
};
