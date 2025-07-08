const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

require('./database'); // Initialize database connection

const app = express();

// === Middleware ===
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3000', // Adjust based on frontend URL
  credentials: true
}));

// === Static File Serving ===
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve frontend files
app.use('/pdfs', express.static(path.join(__dirname, '../pdfs'))); // Serve PDFs

// === API Routes ===
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tax', require('./routes/tax'));
app.use('/api/password', require('./routes/password'));
app.use('/api/userdata', require('./routes/userdata')); // 👈 This handles /api/userdata/users

// === Frontend Fallback ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// === Error Handling ===
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;