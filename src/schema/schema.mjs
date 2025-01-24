import Joi from "joi";

const userSchema = Joi.object({
	firstName: Joi.string().max(50).required(),
	lastName: Joi.string().max(50).required(),
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.max(320)
		.required(),
	password: Joi.string()
		.min(8)
		.max(255)
		// .pattern(
		// 	new RegExp(
		// 		"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
		// 	)
		// )
		.required(),
	// .messages({
	// 	"string.min": "Password must be at least 8 characters long.",
	// 	"string.pattern.base":
	// 		"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
	// }),
});

export { userSchema };
