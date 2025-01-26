import Joi from "joi";

const IssueCreateSchema = Joi.object({
	title: Joi.string().max(255).required(),
	description: Joi.string().max(1000).optional(),
});

export { IssueCreateSchema };
