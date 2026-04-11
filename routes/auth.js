const express = require('express');
const passport = require('../config/passport');

const router = express.Router();

// Start Google login
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Callback after login
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/?login=failed'
  }),
  (req, res) => {
    res.redirect('/?login=success');
  }
);

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((error) => {
    if (error) return next(error);

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/?logout=success');
    });
  });
});
module.exports = router;
