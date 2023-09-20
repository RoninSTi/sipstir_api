const { User } = require("../db/db");

const validatePostAuthApple = {
  schema: {
    body: {
      type: "object",
      properties: {
        identityToken: { type: "string" },
      },
      required: ["identityToken"],
    },
  },
};

const validatePostAuthFacebook = {
  schema: {
    body: {
      type: "object",
      properties: {
        fbToken: { type: "string" },
      },
      required: ["fbToken"],
    },
  },
};

const validatePostForgot = {
  body: {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email"
      },
    },
    required: ["email"],
  },
};

const validatePostLogin = {
  preHandler: [
    async function (req) {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw new Error("Unauthorized.");
      }

      const isCorrect = user.correctPassword(password);

      if (!isCorrect) {
        throw new Error("Unauthorized.");
      }
    },
  ],
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", format: "email" },
    },
    required: ["email", "password"],
  },
};

const validatePostLogout = {
  preValidation: [
    async function (request) {
      return await request.jwtVerify();
    },
  ],
};

const validatePostPasswordReset = {
  body: {
    type: "object",
    properties: {
      otp: {
        type: "string",
      },
      password: {
        type: "string",
      },
    },
    required: ["otp", "password"],
  },
};

const validatePostRegister = {
  preHandler: [
    async function (req) {
      const { email } = req.body;

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (user) {
        throw new Error("Unauthorized.");
      }
    },
  ],
  body: {
    type: "object",
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
    required: ["email", "password"],
  },
};

module.exports = {
  validatePostAuthApple,
  validatePostAuthFacebook,
  validatePostForgot,
  validatePostLogin,
  validatePostLogout,
  validatePostPasswordReset,
  validatePostRegister,
};
