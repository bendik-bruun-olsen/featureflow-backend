const IssueCreateSchema = Joi.object({
	title: Joi.string().max(255).required(),
	description: Joi.string().max(1000).optional(),
	status: Joi.string().valid("open", "in progress", "resolved"),
});

export { IssueCreateSchema };
