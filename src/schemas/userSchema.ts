import Joi from "joi";

const username = Joi.string().min(3).max(20);
const email = Joi.string().email();
const password = Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"));

const registerUserSchema = Joi.object({
  username: username.required(),
  email: email.required(),
  password: password.required(),
});

const loginUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

export { registerUserSchema, loginUserSchema };
