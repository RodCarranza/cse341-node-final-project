const productSchema = require('../validation/productValidation');

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body, {
    abortEarly: false
  });

  if (error) {
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details.map((detail) => detail.message)
    });
  }

  next();
};

module.exports = validateProduct;
