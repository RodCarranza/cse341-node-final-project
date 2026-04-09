const express = require('express');

const router = express.Router();

router.get('/profile', (req, res) => {
  res.status(200).json({ message: 'User profile route working' });
});

module.exports = router;
