const express = require('express');
const validateProduct = require('../middleware/validateProduct');
const { ensureAuth } = require('../middleware/auth');
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productsController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', ensureAuth, validateProduct, createProduct);
router.put('/:id', ensureAuth, validateProduct, updateProduct);
router.delete('/:id', ensureAuth, deleteProduct);

module.exports = router;
