import { Router } from 'express';
import Bill from '../models/Bill.js';
import mongoose from 'mongoose';

const router = Router();

router.use((req, res, next) => {
  if (!req.session.user)
    return res.status(401).json({ error: 'Not authenticated' });
  next();
});

// Get all bills
router.get('/', async (req, res) => {
  const bills = await Bill.find()
    .populate('participants.user', 'username name')
    .populate('owner', 'username name');
  res.json(bills);
});

// Create a bill
router.post('/', async (req, res) => {
  const { title, description, transferInfo, participants, amount } = req.body;
  if (!title || !participants?.length || !amount) {
    return res
      .status(400)
      .json({ error: 'Title, amount and participants are required' });
  }

  const newBill = new Bill({
    title,
    description: description || '',
    amount,
    owner: req.session.user.id,
    transferInfo: transferInfo || '',
    participants: participants.map((p) => ({
      user: p,
      paid: p === req.session.user.id,
    })),
  });

  await newBill.save();
  res.status(201).json(newBill);
});

// Toggle paid/unpaid
router.put('/:id/togglePaid', async (req, res) => {
  const myid = req.session.user.id;
  const bill = await Bill.findById(req.params.id);
  if (!bill) return res.status(404).json({ error: 'Bill not found' });

  const participant = bill.participants.find((p) => p.user.toString() === myid);
  if (!participant)
    return res.status(400).json({ error: 'You are not a participant' });

  participant.paid = !participant.paid;
  await bill.save();

  let populatedBill = await bill.populate('participants.user', 'username name')
  populatedBill = await bill.populate('owner', 'username name');

  res.json(populatedBill);
});

// Get unpaid bills for me
router.get('/unpaid/me', async (req, res) => {
  const myOid = mongoose.Types.ObjectId.createFromHexString(
    req.session.user.id,
  );
  const list = await Bill.find({
    participants: {
      $elemMatch: { user: myOid, paid: false },
    },
  })
    .populate('participants.user', 'username name')
    .populate('owner', 'username name');

  res.json(list);
});

router.delete('/:id', async (req, res) => {
  const myid = req.session.user.id;
  const bill = await Bill.findById(req.params.id);

  if (!bill) return res.status(404).json({ error: 'Bill not found' });

  // Chỉ owner mới có quyền xóa
  if (bill.owner.toString() !== myid) {
    return res.status(403).json({ error: 'Only the owner can delete this bill' });
  }

  await bill.deleteOne();
  res.json({ ok: true, message: 'Bill deleted successfully' });
});


export default router;
