const express = require('express');
const {
  getCartByUserId,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart
} = require('../controllers/cartController');
const { validateAddToCart, validateUpdateCartQuantity } = require('../middleware/validateCart');

const router = express.Router();

router.get('/:userId', getCartByUserId);
router.post('/', validateAddToCart, addItemToCart);
router.put('/:userId/items/:productId', validateUpdateCartQuantity, updateCartItemQuantity);
router.delete('/:userId/items/:productId', removeItemFromCart);

module.exports = router;
