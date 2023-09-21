require("dotenv").config();

const server = require("./server");

const db = require("./api/db/db");

return db.sequelize.sync({ alter: true })
  .then(() => {
    const serverOptions = {
      logSeverity: process.env.LOG_SEVERITY,
    };

    server.createServer(serverOptions);
  })
  .catch((err) => {
    console.log(err);
  });
