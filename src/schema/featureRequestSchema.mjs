import Joi from "joi";

const featureRequestSchema = Joi.object({
	title: Joi.string().max(255).required(),
	status: Joi.string()
		.valid("pending", "in progress", "completed")
		.default("pending"),
	createdBy: Joi.number().integer().positive().required(),
});

export { featureRequestSchema };
