const User = require('../models/user');
const PasswordReset = require('../models/passwordReset');
const crypto = require('crypto');
const nodemailer = require('nodemailer'); // You'll need to install this

// Configure email transporter (example for Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const passwordController = {
  requestReset: async (req, res) => {
    try {
      const { fpEmail, fpContactNo } = req.body;
      
      // Find user by email or contact number
      const user = await new Promise((resolve, reject) => {
        db.get(
          `SELECT * FROM users WHERE email = ? OR contact_no = ?`,
          [fpEmail, fpContactNo],
          (err, row) => {
            if (err) return reject(err);
            resolve(row);
          }
        );
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Create reset token
      const token = await PasswordReset.createToken(user.id);
      
      // Send email with reset link
      const resetLink = `http://localhost:3000/reset-password?token=${token}`;
      
      await transporter.sendMail({
        to: user.email,
        subject: 'Password Reset Request',
        html: `Click <a href="${resetLink}">here</a> to reset your password.`
      });
      
      res.json({ message: 'Password reset link sent to your email' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;
      
      // Validate token
      const resetRecord = await PasswordReset.findByToken(token);
      if (!resetRecord) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      
      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, resetRecord.user_id],
          function(err) {
            if (err) return reject(err);
            resolve();
          }
        );
      });
      
      // Mark token as used
      await PasswordReset.markAsUsed(token);
      
      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = passwordController;