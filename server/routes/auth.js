import { Router } from 'express';
import { withDB } from '../db/db.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  const user = await withDB(async (db) => db.users.find(u => u.username === username && u.password === password));
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });

  req.session.user = { username: user.username };
  res.json({ ok: true, user: req.session.user });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ user: null });
  res.json({ user: req.session.user });
});

export default router;