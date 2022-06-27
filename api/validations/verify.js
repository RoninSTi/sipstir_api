const validateGetVerify = {
  schema: {
    query: {
      type: "object",
      properties: {
        otp: {
          type: "string",
        },
      },
      required: ["otp"],
    },
  },
};

module.exports = {
  validateGetVerify,
};
