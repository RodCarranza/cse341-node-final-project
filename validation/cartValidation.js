const Joi = require('joi');

const addToCartSchema = Joi.object({
  userId: Joi.string().trim().required(),
  productId: Joi.string().trim().required(),
  quantity: Joi.number().integer().min(1).required()
});

const updateCartQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(1).required()
});

module.exports = {
  addToCartSchema,
  updateCartQuantitySchema
};
