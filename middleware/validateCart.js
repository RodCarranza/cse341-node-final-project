const { addToCartSchema, updateCartQuantitySchema } = require('../validation/cartValidation');

const validateAddToCart = (req, res, next) => {
  const { error } = addToCartSchema.validate(req.body, {
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

const validateUpdateCartQuantity = (req, res, next) => {
  const { error } = updateCartQuantitySchema.validate(req.body, {
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

module.exports = {
  validateAddToCart,
  validateUpdateCartQuantity
};
