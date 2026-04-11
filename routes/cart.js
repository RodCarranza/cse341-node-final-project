const express = require('express');
const {
  getCartByUserId,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart
} = require('../controllers/cartController');
const { validateAddToCart, validateUpdateCartQuantity } = require('../middleware/validateCart');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/:userId', ensureAuth, getCartByUserId);
router.post('/', ensureAuth, validateAddToCart, addItemToCart);
router.put(
  '/:userId/items/:productId',
  ensureAuth,
  validateUpdateCartQuantity,
  updateCartItemQuantity
);
router.delete('/:userId/items/:productId', ensureAuth, removeItemFromCart);

module.exports = router;
