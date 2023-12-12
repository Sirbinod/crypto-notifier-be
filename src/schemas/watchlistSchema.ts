import Joi from "joi";

const code = Joi.string();
const minPrice = Joi.number();
const maxPrice = Joi.number();

const watchlistSchema = Joi.object({
  code: code.required(),
  minPrice: minPrice.required(),
  maxPrice: maxPrice.required(),
});



export { watchlistSchema };
