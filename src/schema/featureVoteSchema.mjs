import Joi from "joi";

const featureVoteSchema = Joi.object({
	featureId: Joi.number().integer().positive().required(),
	vote: Joi.number().valid(1, -1).required(),
});

export { featureVoteSchema };
