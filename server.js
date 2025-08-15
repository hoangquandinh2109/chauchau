import express from 'express';
import path from 'path';
const app = express();

// API endpoints
app.get('/api/data1', (req, res) => {
  res.json({ message: 'This is API 1' });
});

app.get('/api/data2', (req, res) => {
  res.json({ message: 'This is API 2' });
});

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
