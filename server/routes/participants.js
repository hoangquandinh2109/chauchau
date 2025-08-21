import { Router } from 'express';
import User from '../models/User.js';

const router = Router();

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username name');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


export default router;
