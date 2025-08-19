import { Router } from 'express';
import { withDB } from '../db/db.js';
import crypto from 'crypto';

const router = Router();

// Auth middleware for bills APIs
router.use((req, res, next) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
});

// Get all bills
router.get('/', async (req, res) => {
  const bills = await withDB(async (db) => db.bills);
  res.json(bills);
});

// Create a bill
router.post('/', async (req, res) => {
  const { title, description, transferInfo, participants } = req.body;
  if (!title || !participants || !Array.isArray(participants) || participants.length === 0) {
    return res.status(400).json({ error: 'Title and participants are required' });
  }

  const id = `bill-${crypto.randomUUID()}`;
  const newBill = {
    id,
    title,
    description: description || '',
    owner: req.session.user.username,
    transferInfo: transferInfo || '',
    participants: participants.map(p => ({ username: p, paid: p === req.session.user.username ? true : false }))
  };

  const created = await withDB(async (db) => {
    db.bills.unshift(newBill);
    return { __write: true, data: db, returnValue: newBill };
  });

  res.status(201).json(created);
});

// Toggle paid/unpaid for the logged-in user on a bill
router.put('/:id/togglePaid', async (req, res) => {
  const billId = req.params.id;
  const me = req.session.user.username;

  const updated = await withDB(async (db) => {
    const bill = db.bills.find(b => b.id === billId);
    if (!bill) return null;
    const participant = bill.participants.find(p => p.username === me);
    if (!participant) return { error: 'You are not a participant' };
    participant.paid = !participant.paid;
    return { __write: true, data: db, returnValue: bill };
  });

  if (!updated) return res.status(404).json({ error: 'Bill not found' });
  if (updated.error) return res.status(400).json(updated);
  res.json(updated);
});

// Get unpaid bills for me
router.get('/unpaid/me', async (req, res) => {
  const me = req.session.user.username;
  const list = await withDB(async (db) => db.bills.filter(b => b.participants.some(p => p.username === me && !p.paid)));
  res.json(list);
});

export default router;