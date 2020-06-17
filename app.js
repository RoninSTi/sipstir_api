const nconf = require("nconf");
const server = require("./server");

const { loadSettings } = require("./config/configurationAdaptor");

const appSettingsPath = process.env.APP_SETTINGS_FILE_PATH;

console.log({ appSettingsPath });

loadSettings({ appSettingsPath })
  .then(() => {
    const db = require("./api/db/db");
    db.sequelize.sync({ alter: true });

    const serverOptions = {
      logSeverity: nconf.get("logSeverity"),
    };

    server.createServer(serverOptions);
  })
  .catch((err) => {
    console.log(err);
  });
