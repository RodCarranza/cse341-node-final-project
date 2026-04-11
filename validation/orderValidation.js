const Joi = require('joi');

const orderItemSchema = Joi.object({
  productId: Joi.string().trim().required(),
  quantity: Joi.number().integer().min(1).required()
});

const orderSchema = Joi.object({
  userId: Joi.string().trim().required(),
  items: Joi.array().items(orderItemSchema).min(1).required(),
  totalAmount: Joi.number().positive().required(),
  status: Joi.string()
    .valid('pending', 'processing', 'shipped', 'delivered', 'cancelled')
    .required(),
  shippingAddress: Joi.string().trim().min(5).max(200).required(),
  paymentMethod: Joi.string().valid('credit card', 'debit card', 'paypal').required()
});

module.exports = orderSchema;
