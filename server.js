const Fastify = require("fastify");
const AutoLoad = require("fastify-autoload");

const jwt = require("@fastify/jwt");
const cookie = require("@fastify/cookie");
const nconf = require("nconf");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const stream = require("getstream");

const mailgun = require("mailgun-js");

const { Points } = require("./api/db/db");

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
    secret: nconf.get("jwt.secret"),
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
        credentials: true,
      };

      // do not include CORS headers for requests from localhost
      if (/^localhost$/m.test(req.headers.origin)) {
        corsOptions.origin = false;
      }

      // callback expects two parameters: error and options
      callback(null, corsOptions);
    };
  });

  // server.register(require("@fastify/cors"), {
  //   credentials: true,
  //   origin: (req, cb) => {
  //     server.log.info(req);
  //     console.log({ req });
  //     const hostname = new URL(origin).hostname;

  //     if (hostname === "localhost") {
  //       //  Request from localhost will pass
  //       cb(null, true);
  //       return;
  //     }

  //     if (hostname === "staging-business.sipstir.app") {
  //       cb(null, true);
  //       return;
  //     }

  //     if (hostname === "business.sipstir.app") {
  //       cb(null, true);
  //       return;
  //     }
  //     // Generate an error on other origins, disabling access
  //     cb(new Error("Not allowed"), false);
  //   },
  // });

  server.register(AutoLoad, {
    dir: path.join(__dirname, "api", "routes"),
  });

  const client = stream.default.connect(
    nconf.get("keys.stream.key"),
    nconf.get("keys.stream.secret"),
    nconf.get("keys.stream.appId"),
    { location: "us-east" }
  );

  server.decorate("client", client);

  const STRIPE_KEY = nconf.get("keys.stripe.secret");
  const stripe = require("stripe")(STRIPE_KEY, { apiVersion: "" });
  server.decorate("stripe", stripe);

  const aws = require("aws-sdk");

  const AWS_ACCESS_KEY_ID = nconf.get("keys.amazon.AWSAccessKeyId");
  const AWS_SECRET_KEY = nconf.get("keys.amazon.AWSSecretKey");

  aws.config.update({
    region: "us-east-2",
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_KEY,
    signatureVersion: "v4",
  });

  const mg = mailgun({
    apiKey: nconf.get("keys.mailgun.key"),
    domain: nconf.get("keys.mailgun.domain"),
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
