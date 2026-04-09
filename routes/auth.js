const express = require('express');

const router = express.Router();

router.get('/google', (req, res) => {
  res.status(200).json({ message: 'Google OAuth start route working' });
});

router.get('/google/callback', (req, res) => {
  res.status(200).json({ message: 'Google OAuth callback route working' });
});

module.exports = router;
