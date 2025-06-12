const express = require('express');
const taxController = require('../controllers/tax');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/current', taxController.getCurrentRegime);
router.post('/switch', taxController.switchRegime);
router.get('/history', taxController.getHistory);

module.exports = router;