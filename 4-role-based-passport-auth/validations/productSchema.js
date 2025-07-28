const Joi = require("joi");

const productSchema = Joi.object({
  title: Joi.string().max(150).required(),
  price: Joi.number().precision(2).min(0).optional(),
  description: Joi.string().max(1000).optional(),
});

const productPatchSchema = Joi.object({
  title: Joi.string().max(150),
  price: Joi.number().precision(2).min(0),
  description: Joi.string().max(1000),
}).min(1);

module.exports = {
  productSchema,
  productPatchSchema,
};
