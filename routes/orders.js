const express = require('express');
const validateOrder = require('../middleware/validateOrder');
const {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
} = require('../controllers/ordersController');

const router = express.Router();

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.post('/', validateOrder, createOrder);
router.put('/:id', validateOrder, updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
