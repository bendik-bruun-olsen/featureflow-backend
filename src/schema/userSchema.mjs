import Joi from "joi";

const userSchema = Joi.object({
	username: Joi.string().max(100).required(),
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.max(320)
		.required(),
	password: Joi.string().min(8).max(255).required(),
	isAdmin: Joi.boolean().default(false),
});

export { userSchema };
