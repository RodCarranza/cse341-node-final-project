const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all orders route working' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get order by ID route working: ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create order route working' });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update order route working: ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete order route working: ${req.params.id}` });
});

module.exports = router;
