import winston from 'winston';

const { combine, printf, label, timestamp } = winston.format;

const myFormart = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}[${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'my-log.log',
    }),
  ],
  format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormart),
});
