import Joi from "joi";

const IssueCommentCreateSchema = Joi.object({
	issueId: Joi.number().integer().required(),
	comment: Joi.string().required().max(5000),
});

export { IssueCommentCreateSchema };
