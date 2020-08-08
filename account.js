import express from 'express';
import { promises as fs } from 'fs';

const router = express.Router();
const { readFile, writeFile } = fs;

router.post('/', async (req, res) => {
  try {
    let account = req.body;
    const data = await readFile('accounts.json');
    const jsonAccounts = JSON.parse(data);

    account = { id: jsonAccounts.nextId, ...account };
    jsonAccounts.nextId++;
    jsonAccounts.accounts.push(account);

    await writeFile('accounts.json', JSON.stringify(jsonAccounts, null, 2));
    res.send(account);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

export default router;
