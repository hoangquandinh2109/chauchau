import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import billsRoutes from './routes/bills.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }
}));

// API routes
app.use('/api', authRoutes);
app.use('/api/bills', billsRoutes);

// Static SPA
app.use(express.static(join(__dirname, '../public')));

// SPA fallback (for manual deep links)
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));