const Fastify = require("fastify");
const AutoLoad = require("fastify-autoload");

const jwt = require("@fastify/jwt");
const cookie = require("@fastify/cookie");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const stream = require("getstream");

const mailgun = require("mailgun-js");

const { Points } = require("./api/db/db");
const { truncate } = require("lodash");

const createRequestId = () => uuidv4();

const createServer = (options) => {
  const { logSeverity } = options;

  const server = Fastify({
    genReqId: createRequestId,
    ignoreTrailingSlash: true,
    logger: {
      level: logSeverity,
    },
  });

  server
    .register(require("fastify-redis"), { url: process.env.REDIS_URL })
    .after(() => {
      Points.buildInitialLeaderboard({ redis: server.redis });
    });

  server.register(jwt, {
    secret: process.env.JWT_SECRET,
    cookie: {
      cookieName: "access_token",
      signed: false,
    },
  });

  server.register(cookie);

  server.register(require("@fastify/cors"), (instance) => {
    return (req, callback) => {
      const corsOptions = {
        // This is NOT recommended for production as it enables reflection exploits
        origin: true,
        credentials: true
      };
  
      // do not include CORS headers for requests from localhost
      if (/^localhost$/m.test(req.headers.origin)) {
        corsOptions.origin = false
      }
  
      // callback expects two parameters: error and options
      callback(null, corsOptions)
    };
  });

  server.register(AutoLoad, {
    dir: path.join(__dirname, "api", "routes"),
  });

  const client = stream.default.connect(
    process.env.STREAM_KEY,
    process.env.STREAM_SECRET,
    process.env.STREAM_APP_ID,
    { location: "us-east" }
  );

  server.decorate("client", client);

  const stripe = require("stripe")(process.env.STRIPE_SECRET, {
    apiVersion: "",
  });
  server.decorate("stripe", stripe);

  const aws = require("aws-sdk");

  aws.config.update({
    region: "us-east-2",
    accessKeyId: process.env.API_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.API_AWS_SECRET_KEY,
    signatureVersion: "v4",
  });

  const mg = mailgun({
    apiKey: process.env.MAILGUN_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

  server.decorate("mg", mg);

  // start the server
  server.listen(
    {
      port: process.env.PORT,
      host: "0.0.0.0",
    },
    (err) => {
      if (err) {
        server.log.error(err);
        console.log(err);
        process.exit(1);
      }

      server.log.info("Server Started");
    }
  );
};

module.exports = {
  createServer,
};
