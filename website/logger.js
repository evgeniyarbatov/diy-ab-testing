const { format, createLogger, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.File({ filename: 'logs/app.log' }) // Write logs to a file
  ]
});

module.exports = logger;