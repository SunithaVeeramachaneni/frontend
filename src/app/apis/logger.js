 const { createLogger,transports,format} = require('winston');

const logger1 = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [

    //new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
    new transports.Console(),
  ],
});

const logger = {
  info: () => ({}),
  error: () => ({}),
  logger1
}

module.exports = logger;
