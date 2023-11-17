const { getRequest } = require('../utils/httpClient');

const crypto = require("crypto");

const getMe = token => {
  return getRequest({ url: `https://graph.facebook.com/me?access_token=${token}` })
}

const getUser = ({ id, token }) => {
  return getRequest({ url: `https://graph.facebook.com/${id}?fields=email,picture.type(large)&access_token=${token}` })
}

function base64decode(data) {
  while (data.length % 4 !== 0) {
    data += "=";
  }
  data = data.replace(/-/g, "+").replace(/_/g, "/");

  return Buffer.from(data, "base64").toString("utf-8");
}

function parseSignedRequest(signedRequest, secret) {
  const encoded_data = signedRequest.split(".", 2);
  // decode the data
  const sig = encoded_data[0];
  const json = base64decode(encoded_data[1]);
  const data = JSON.parse(json);

  if (!data.algorithm || data.algorithm.toUpperCase() != "HMAC-SHA256") {
    throw Error(
      "Unknown algorithm: " + data.algorithm + ". Expected HMAC-SHA256"
    );
  }

  const expected_sig = crypto
    .createHmac("sha256", secret)
    .update(encoded_data[1])
    .digest("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace("=", "");

  if (sig !== expected_sig) {
    throw Error("Invalid signature: " + sig + ". Expected " + expected_sig);
  }

  return data;
}

module.exports = {
  getMe,
  getUser,
  parseSignedRequest
}
