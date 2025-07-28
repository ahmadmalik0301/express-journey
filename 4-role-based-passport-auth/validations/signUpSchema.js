const Joi = require("joi");

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),

  name: Joi.string().min(3).max(10).required(),

  password: Joi.string().min(6).max(30).required(),

  age: Joi.number().integer().min(13).required(),

  secretKey: Joi.string().optional(),
});

module.exports = signUpSchema;
