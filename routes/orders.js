const express = require('express');
const validateOrder = require('../middleware/validateOrder');
const { ensureAuth } = require('../middleware/auth');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/ordersController');

const router = express.Router();

router.get('/', ensureAuth, getAllOrders);
router.get('/:id', ensureAuth, getOrderById);
router.post('/', ensureAuth, validateOrder, createOrder);
router.put('/:id', ensureAuth, validateOrder, updateOrder);
router.delete('/:id', ensureAuth, deleteOrder);

module.exports = router;
