import Joi from "joi";

const featureRequestCreateSchema = Joi.object({
	title: Joi.string().max(255).required(),
	description: Joi.string().max(1000).optional(),
	createdBy: Joi.number().integer().positive().required(),
});

const featureRequestUpdateSchema = Joi.object({
	title: Joi.string().max(255).optional(),
	description: Joi.string().max(1000).optional(),
	status: Joi.string().valid("pending", "in progress", "completed").optional(),
});

export { featureRequestCreateSchema, featureRequestUpdateSchema };
