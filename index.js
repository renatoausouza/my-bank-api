import express from 'express';
import winston from 'winston';
import accountsRouter from './accounts.js';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

const app = express();
app.use(express.json());
app.use('/account', accountsRouter);

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

app.listen(3000, async () => {
  const initialJson = {
    nextId: 1,
    accounts: [],
  };
  try {
    await readFile('accounts.json');
    logger.info('My Bank API started!');
  } catch (erro) {
    writeFile('accounts.json', JSON.stringify(initialJson))
      .then(() => {
        logger.info('My Bank API started!');
      })
      .catch((err) => {
        logger.error(err);
      });
  }
});
