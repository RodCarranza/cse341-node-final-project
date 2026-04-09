const express = require('express');

const router = express.Router();

router.get('/:userId', (req, res) => {
  res.status(200).json({ message: `Get cart route working for user: ${req.params.userId}` });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Add item to cart route working' });
});

router.put('/:userId/items/:productId', (req, res) => {
  res.status(200).json({
    message: `Update cart item route working for user ${req.params.userId} and product ${req.params.productId}`
  });
});

router.delete('/:userId/items/:productId', (req, res) => {
  res.status(200).json({
    message: `Delete cart item route working for user ${req.params.userId} and product ${req.params.productId}`
  });
});

module.exports = router;
