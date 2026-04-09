const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Get all products route working' });
});

router.get('/:id', (req, res) => {
  res.status(200).json({ message: `Get product by ID route working: ${req.params.id}` });
});

router.post('/', (req, res) => {
  res.status(201).json({ message: 'Create product route working' });
});

router.put('/:id', (req, res) => {
  res.status(200).json({ message: `Update product route working: ${req.params.id}` });
});

router.delete('/:id', (req, res) => {
  res.status(200).json({ message: `Delete product route working: ${req.params.id}` });
});

module.exports = router;
