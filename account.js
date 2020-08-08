import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();
const { readFile, writeFile } = fs;

global.fileName = 'accounts.json';

router.post('/', async (req, res) => {
  try {
    let account = req.body;
    const data = await readFile(global.fileName);
    const jsonAccounts = JSON.parse(data);

    account = { id: jsonAccounts.nextId, ...account };
    jsonAccounts.nextId++;
    jsonAccounts.accounts.push(account);

    await writeFile(global.fileName, JSON.stringify(jsonAccounts, null, 2));
    res.send(account);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const data = await readFile(global.fileName);
    const jsonAccounts = JSON.parse(data);
    delete jsonAccounts.nextId;
    res.send(jsonAccounts);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await readFile(global.fileName);
    const jsonAccounts = JSON.parse(data);
    const account = jsonAccounts.accounts.find(
      (account) => account.id === parseInt(req.params.id)
    );

    res.send(account);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
