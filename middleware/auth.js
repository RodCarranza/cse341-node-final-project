const ensureAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'test' && process.env.AUTH_BYPASS === 'true') {
    req.user = {
      _id: '000000000000000000000001',
      name: 'Test User',
      email: 'test@example.com',
      role: 'customer',
      googleId: 'test-google-id'
    };
    return next();
  }

  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }

  return res.status(401).json({ message: 'Unauthorized. Please log in first.' });
};

module.exports = { ensureAuth };
