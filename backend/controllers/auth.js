const User = require('../models/user');
const db = require('../database'); // Added this line

const authController = {
  login: async (req, res) => {
    try {
      const { userId: personnel_no, password } = req.body;
      const user = await User.findByPersonnelNo(personnel_no);

      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      const isMatch = await User.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }

      // Set cookie
      res.cookie('userId', user.id, {
        maxAge: 86400000, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.json({
        success: true,
        message: "Logged in!",
        user: {
          id: user.id,
          personnel_no: user.personnel_no,
          name: user.name,
          email: user.email,
          level: user.level
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  signup: async (req, res) => {
    try {
      const { signupUserId: personnel_no, userName: name, email, contactNo: contact_no, signupPassword: password } = req.body;

      const existingUser = await User.findByPersonnelNo(personnel_no);
      if (existingUser) {
        return res.status(400).json({ success: false, error: 'User already exists' });
      }

      const userId = await User.create({
        personnel_no,
        name,
        email,
        contact_no,
        password,
        level: 'Employee'
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        id: userId
      });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ success: false, error: 'Email already exists' });
      }
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  },

  logout: (req, res) => {
    res.clearCookie('userId');
    res.json({ success: true, message: 'Logged out successfully' });
  },

  getCurrentUser: async (req, res) => {
    try {
      const userId = req.userId;
      db.get(
        'SELECT id, personnel_no, name, email, contact_no, level FROM users WHERE id = ?',
        [userId],
        (err, user) => {
          if (err || !user) {
            return res.status(404).json({ success: false, error: 'User not found' });
          }
          res.json({ success: true, user });
        }
      );
    } catch (error) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
};

module.exports = authController;
