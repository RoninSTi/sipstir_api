const Fastify = require('fastify');
const AutoLoad = require('fastify-autoload');

const nconf = require('nconf');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const stream = require('getstream');

const bsCheckPermissions = require('./api/plugins/check-permissions');

const { Points } = require('./api/db/db');

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
    .register(require('fastify-redis'), { host: 'redis' })
    .after(() => {
      Points.buildInitialLeaderboard({ redis: server.redis });
    });

  server.register(require('fastify-auth0-verify'), {
    audience: nconf.get('keys.auth0.audience'),
    domain: nconf.get('keys.auth0.domain'),
    secret: nconf.get('keys.auth0.clientSecret'),
  });

  server.register(bsCheckPermissions)

  server.register(require('fastify-cors'), {
    origin: (origin, cb) => {
      if (/localhost/.test(origin) || origin === undefined) {
        //  Request from localhost will pass
        cb(null, true);
        return;
      }

      if (origin === 'https://barsnap-staging.herokuapp.com') {
        cb(null, true);
        return;
      }
      cb(new Error('Not allowed'), false);
    },
  });

  server.register(AutoLoad, {
    dir: path.join(__dirname, 'api', 'routes'),
  });

  server.addHook('onRequest', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  const client = stream.default.connect(nconf.get('keys.stream.key'), nconf.get('keys.stream.secret'), nconf.get('keys.stream.appId'), { location: 'us-east' });

  server.decorate('client', client);

  // start the server
  server.listen(process.env.PORT, '0.0.0.0', (err) => {
    if (err) {
      server.log.error(err);
      console.log(err);
      process.exit(1);
    }

    server.log.info('Server Started');
  });
};

module.exports = {
  createServer,
};
