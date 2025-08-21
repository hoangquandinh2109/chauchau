import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import billsRoutes from './routes/bills.js';
import participantsRoutes from './routes/participants.js';
import { connectDB } from './db/db.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/bills', billsRoutes);
app.use('/api/participants', participantsRoutes);

// Static SPA
app.use(express.static(join(__dirname, '../public')));

// SPA fallback (for manual deep links)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));