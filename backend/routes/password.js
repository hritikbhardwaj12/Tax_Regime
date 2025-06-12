const express = require('express');
const passwordController = require('../controllers/password');

const router = express.Router();

router.post('/request-reset', passwordController.requestReset);
router.post('/reset', passwordController.resetPassword);

module.exports = router;