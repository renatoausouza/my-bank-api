import express from 'express';
import winston from 'winston';
import accountsRouter from './account.js';
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const { combine, printf, label, timestamp } = winston.format;

const myFormart = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}[${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
  level: 'silly',
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'my-bank-api.log',
    }),
  ],
  format: combine(label({ label: 'my-bank-api' }), timestamp(), myFormart),
});

const app = express();
app.use(express.json());
app.use('/account', accountsRouter);
app.listen(3000, async () => {
  const initialJson = {
    nextId: 1,
    accounts: [],
  };
  try {
    await readFile('accounts.json');
    global.logger.info('My Bank API started!');
  } catch (erro) {
    writeFile('accounts.json', JSON.stringify(initialJson, null, 2))
      .then(() => {
        global.logger.info('My Bank API started!');
      })
      .catch((err) => {
        global.logger.error(err);
      });
  }
});
