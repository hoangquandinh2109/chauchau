import { Router } from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = Router();

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Missing credentials' });

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ error: 'Invalid username or password' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid username or password' });

  req.session.user = { id: user._id, username: user.username, name: user.name };
  res.json({ ok: true, user: req.session.user });
});

// SIGNUP
router.post('/signup', async (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) return res.status(400).json({ error: 'Missing username, password, or name' });

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ error: 'Username already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashed, name });
  await newUser.save();

  req.session.user = { id: newUser._id, username: newUser.username, name: newUser.name };
  res.status(201).json({ ok: true, user: req.session.user });
});


// LOGOUT
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

router.get('/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ user: null });
  res.json({ user: req.session.user });
});

export default router;
