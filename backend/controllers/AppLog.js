const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");

const logger = winston.createLogger({
  //   level: "info",

  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    // new winston.transport.Console({}),
    new winston.transports.File({
      filename: "logs/application.log",
      prettyPrint: function (object) {
        return JSON.stringify(object);
      },
    }),
    new DailyRotateFile({
      dirname: "logs/backup",
      filename: "logs/backup/app-%DATE%.log",
      zippedArchive: true,
      // max file size
      maxSize: "5m",
      // lma file akan disimpan
      maxFiles: "14d",
    }),
  ],
});

module.exports = { logger };
