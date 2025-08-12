import Joi from "joi";
const loginScheme = Joi.object({
    email: Joi.string().email().max(150).required(),
    password: Joi.string().required().min(8).max(255),
});
export default loginScheme;
