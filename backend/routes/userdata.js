const express = require('express');
const router = express.Router();

// Route to fetch only the logged-in user's data
router.get('/users', (req, res) => {
  const loggedInUserId = req.session?.user?.userId;

  if (!loggedInUserId) {
    return res.status(401).json({ error: 'Unauthorized: No user logged in' });
  }

  const sql = `
    SELECT 
      id,
      user_id AS userId,
      user_name AS name,
      email,
      contact_no AS contact
    FROM users
    WHERE user_id = ?
  `;

  req.app.locals.db.query(sql, [loggedInUserId], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ 
        error: "Failed to fetch user data",
        details: err.message 
      });
    }

    // Add serial number (always 1 in this case)
    const data = results.map((row, index) => ({
      serial: index + 1,
      ...row
    }));

    res.json(data);
  });
});

module.exports = router;
