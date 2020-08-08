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

router.post('/', async (req, res) => {
  try {
    let account = req.body;
    const accounts = await readJson(global.fileName);

    account = { id: accounts.nextId, ...account };
    accounts.nextId++;
    accounts.accounts.push(account);

    await writeJson(global.fileName, accounts);
    res.send(account);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const accounts = await readJson(global.fileName);
    delete accounts.nextId;
    res.send(accounts);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const accounts = await readJson(global.fileName);
    const account = accounts.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );

    res.send(account);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const accounts = await readJson(global.fileName);
    const account = accounts.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );
    accounts.accounts = accounts.accounts.filter(
      (account) => account.id !== parseInt(req.params.id)
    );

    await writeJson(global.fileName, accounts);
    res.send(account);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let accountNew = req.body;
    const accounts = await readJson(global.fileName);
    const index = accounts.accounts.findIndex(
      (accountOld) => accountOld.id === accountNew.id
    );
    accounts.accounts[index] = accountNew;
    await writeJson(global.fileName, accounts);
    res.send(accountNew);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.patch('/updateBalance', async (req, res) => {
  try {
    let accountNewBalance = req.body;
    const accounts = await readJson(global.fileName);
    const index = accounts.accounts.findIndex(
      (account) => account.id === accountNewBalance.id
    );
    accounts.accounts[index].balance = accountNewBalance.balance;
    await writeJson(global.fileName, accounts);
    res.send(accounts.accounts[index]);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
