const TaxSelection = require('../models/tax');

const taxController = {
  getCurrentRegime: async (req, res) => {
    try {
      const userId = req.userId;
      const currentYear = new Date().getFullYear().toString();
      
      const selection = await TaxSelection.findByUserAndYear(userId, currentYear);
      res.json(selection || { regime: 'new' }); // Default to new regime
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  switchRegime: async (req, res) => {
    try {
      const userId = req.userId;
      const { regime } = req.body;
      const currentYear = new Date().getFullYear().toString();
      
      if (!['new', 'old'].includes(regime)) {
        return res.status(400).json({ error: 'Invalid regime selection' });
      }
      
      // Check if user has already switched this year
      const count = await TaxSelection.countByUserAndYear(userId, currentYear);
      if (count > 0) {
        return res.status(400).json({ 
          error: 'You can only switch once per financial year' 
        });
      }
      
      const selectionId = await TaxSelection.create(userId, regime, currentYear);
      res.json({ 
        id: selectionId, 
        regime, 
        financial_year: currentYear,
        message: 'Tax regime updated successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getHistory: async (req, res) => {
    try {
      const userId = req.userId;
      const history = await TaxSelection.getHistory(userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = taxController;