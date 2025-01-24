import Joi from "joi";

const featureRequestCreateSchema = Joi.object({
	title: Joi.string().max(255).required(),
	createdBy: Joi.number().integer().positive().required(),
});

const featureRequestUpdateSchema = Joi.object({
	title: Joi.string().max(255).required(),
	status: Joi.string().valid("pending", "in progress", "completed"),
});

export { featureRequestCreateSchema, featureRequestUpdateSchema };
