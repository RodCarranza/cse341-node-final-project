const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().trim().min(3).max(100).required(),
  description: Joi.string().trim().min(3).max(500).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().trim().min(2).max(50).required(),
  stock: Joi.number().integer().min(0).required(),
  brand: Joi.string().trim().min(2).max(50).required(),
  imageUrl: Joi.string().uri().required()
});

module.exports = productSchema;
