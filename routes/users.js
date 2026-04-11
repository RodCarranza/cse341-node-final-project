const express = require('express');
const { ensureAuth } = require('../middleware/auth');
const { deleteCurrentUser } = require('../controllers/usersController');

const router = express.Router();

router.get('/profile', ensureAuth, (req, res) => {
  res.status(200).json({
    message: 'User profile retrieved successfully',
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      googleId: req.user.googleId
    }
  });
});

router.delete('/me', ensureAuth, deleteCurrentUser);

module.exports = router;
