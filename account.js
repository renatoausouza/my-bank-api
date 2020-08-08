import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();
const { readFile, writeFile } = fs;

global.fileName = 'accounts.json';

async function readJson(filename) {
  const data = await readFile(global.fileName);
  const jsonAccounts = JSON.parse(data);
  return jsonAccounts;
}

async function writeJson(filename, json) {
  await writeFile(filename, JSON.stringify(json, null, 2));
}

router.post('/', async (req, res, next) => {
  try {
    let account = req.body;

    if (!account.name || account.balance == null) {
      throw new Error('Name and Balance are required.');
    }

    const accounts = await readJson(global.fileName);

    account = {
      id: accounts.nextId,
      name: account.name,
      balance: account.balance,
      ...account,
    };
    accounts.nextId++;
    accounts.accounts.push(account);

    await writeJson(global.fileName, accounts);
    global.logger.info('POST /account');
    res.send(account);
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const accounts = await readJson(global.fileName);
    delete accounts.nextId;
    global.logger.info('GET /account');
    res.send(accounts);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const accounts = await readJson(global.fileName);
    const account = accounts.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    if (account == null) {
      throw new Error('Account not found');
    } else {
      global.logger.info('GET /account/:id');
      res.send(account);
    }
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const accounts = await readJson(global.fileName);
    const account = accounts.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    accounts.accounts = accounts.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );

    await writeJson(global.fileName, accounts);
    global.logger.info('DELETE /account/:id');
    res.send(account);
  } catch (err) {
    next(err);
  }
});

router.put('/', async (req, res, next) => {
  try {
    let accountNew = req.body;
    if (!account.name || account.balance == null) {
      throw new Error('Name and Balance are required.');
    }

    const accounts = await readJson(global.fileName);
    const index = accounts.accounts.findIndex(
      (accountOld) => accountOld.id === accountNew.id
    );
    if (!accountNew.id || !accountNew.name || !accountNew.balance == null) {
      throw new Error('Id, name and balance are required.');
    } else if (index === -1) {
      throw new Error('Account not found.');
    } else {
      accounts.accounts[index].name = accountNew.name;
      accounts.accounts[index].balance = accountNew.balance;
      await writeJson(global.fileName, accounts);
      global.logger.info('PUT /account');
      res.send(accountNew);
    }
  } catch (err) {
    next(err);
  }
});

router.patch('/updateBalance', async (req, res, next) => {
  try {
    let accountNewBalance = req.body;
    const accounts = await readJson(global.fileName);
    const index = accounts.accounts.findIndex(
      (account) => account.id === accountNewBalance.id
    );
    if (!accountNewBalance.id || !accountNewBalance.balance == null) {
      throw new Error('Id and the new balance are required.');
    } else if (index === -1) {
      throw new Error('Account not found.');
    } else {
      accounts.accounts[index].balance = accountNewBalance.balance;
      await writeJson(global.fileName, accounts);
      global.logger.info('PATCH /account');
      res.send(accounts.accounts[index]);
    }
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next) => {
  global.logger.error(`${req.method} ${req.baseUrl} -  ${err.message}`);
  res.status(400).send({ erro: err.message });
});

export default router;
