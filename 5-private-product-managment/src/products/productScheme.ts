import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string().trim().max(150).required(),
  description: Joi.string().trim().allow(null, "").optional(),
  price: Joi.number().precision(2).positive().allow(null).optional(),
  stock: Joi.number().integer().min(0).allow(null).optional(),
});

export const updateProductSchema = Joi.object({
  name: Joi.string().trim().max(150).optional(),
  description: Joi.string().trim().allow(null, "").optional(),
  price: Joi.number().precision(2).positive().allow(null).optional(),
  stock: Joi.number().integer().min(0).allow(null).optional(),
}).min(1);
