'use strict';

const {format, createLogger, transports} = require('winston');

/**
 * Creates logger and saves the log
 * @param {string} filename Filename to write to
 * @return {winston.Logger} Logger instance
 */
function getLogger(filename) {
  return createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.json(),
    ),
    transports: [
      new transports.File({filename: filename}),
    ],
  });
}

module.exports = {
  getLogger,
};
