import Joi from "joi";

const registrationScheme = Joi.object({
  first_name: Joi.string().min(3).max(100).required(),
  last_name: Joi.string().min(3).max(100).required(),
  age: Joi.number().integer().min(0).optional(),
  phone_number: Joi.string().max(20).required(),
  email: Joi.string().email().max(150).required(),
  country: Joi.string().max(100).optional().empty(""),
  address: Joi.string().optional().empty(""),
  password: Joi.string().required().min(8).max(255),
}).required();

export default registrationScheme;
