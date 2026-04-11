const orderSchema = require('../validation/orderValidation');

const validateOrder = (req, res, next) => {
  const { error } = orderSchema.validate(req.body, {
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

module.exports = validateOrder;
