const User = require('../models/user');

const authController = {
  login: async (req, res) => {
    try {
      const { userId: personnel_no, password } = req.body;
      const user = await User.findByPersonnelNo(personnel_no);
      
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      // Set cookie
      res.cookie('userId', user.id, { 
        maxAge: 86400000, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
      
      res.json({ 
        id: user.id, 
        personnel_no: user.personnel_no,
        name: user.name,
        email: user.email,
        level: user.level
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  signup: async (req, res) => {
    try {
      const { signupUserId: personnel_no, userName: name, email, contactNo: contact_no, signupPassword: password } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findByPersonnelNo(personnel_no);
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      
      const userId = await User.create({ 
        personnel_no, 
        name, 
        email, 
        contact_no, 
        password,
        level: 'Employee' // Default level
      });
      
      res.status(201).json({ 
        message: 'User created successfully',
        id: userId 
      });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  logout: (req, res) => {
    res.clearCookie('userId');
    res.json({ message: 'Logged out successfully' });
  },

  getCurrentUser: async (req, res) => {
    try {
      const userId = req.userId;
      db.get(
        'SELECT id, personnel_no, name, email, contact_no, level FROM users WHERE id = ?',
        [userId],
        (err, user) => {
          if (err || !user) {
            return res.status(404).json({ error: 'User not found' });
          }
          res.json(user);
        }
      );
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = authController;