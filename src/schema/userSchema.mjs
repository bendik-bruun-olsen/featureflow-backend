import Joi from "joi";

const userCreateSchema = Joi.object({
	username: Joi.string().max(100).required(),
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.max(320)
		.required(),
	password: Joi.string().min(8).max(255).required(),
});

const userLoginSchema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.max(320)
		.required(),
	password: Joi.string().min(8).max(255).required(),
});

export { userCreateSchema, userLoginSchema };
