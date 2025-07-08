const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const session = require('express-session'); // ✅ Move to the top

// === App Initialization ===
const app = express();
const PORT = process.env.PORT || 3001;

// === MySQL Connection ===
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hritik@2002',
  database: 'taxregime'
});

db.connect((err) => {
  if (err) {
    console.error('❌ MySQL connection error:', err.message);
    process.exit(1);
  }
  console.log('✅ Connected to MySQL database!');
  app.locals.db = db; // ✅ Set db for routes
});

// === Middleware (ORDER MATTERS!) ===
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true only if using HTTPS
}));

app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Static Files ===
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/pdfs', express.static(path.join(__dirname, '../pdfs')));

// === Auth APIs ===
app.post('/api/auth/signup', (req, res) => {
  const { signupUserId, userName, email, contactNo, signupPassword } = req.body;

  if (!signupUserId || !userName || !email || !contactNo || !signupPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = 'INSERT INTO users (user_id, user_name, email, contact_no, password) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [signupUserId, userName, email, contactNo, signupPassword], (err) => {
    if (err) {
      return res.status(400).json({ message: 'User may already exist', error: err.message });
    }
    res.status(200).json({ message: 'User registered successfully!' });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { userId, password } = req.body;

  const sql = 'SELECT * FROM users WHERE user_id = ? AND password = ?';
  db.query(sql, [userId, password], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length > 0) {
      const user = results[0];

      // ✅ Store user in session
      req.session.user = {
        userId: user.user_id,
        user_name: user.user_name
      };

      res.status(200).json({
        message: 'Login successful!',
        user: {
          userId: user.user_id,
          user_name: user.user_name
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

app.post('/api/password/request-reset', (req, res) => {
  const { email, contactNo } = req.body;

  if (!email && !contactNo) {
    return res.status(400).json({ message: 'Please provide email or contact number' });
  }

  const sql = 'SELECT * FROM users WHERE email = ? OR contact_no = ?';
  db.query(sql, [email, contactNo], (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error', error: err.message });

    if (results.length > 0) {
      res.status(200).json({ message: 'User found. Reset instructions sent (mock).' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

// === User Data Route ===
const userdataRoutes = require('./routes/userdata');
app.use('/api/userdata', userdataRoutes);

// === Frontend Fallback ===
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.use('/pdfs', express.static(path.join(__dirname, '../pdfs')));
