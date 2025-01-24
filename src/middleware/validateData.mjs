import {
	userSchema,
	featureRequestCreateSchema,
} from "../schema/userSchema.mjs";

const validateData = (schema) => (req, res, next) => {
	const { error } = schema.validate(req.body, { abortEarly: false });
	if (error) {
		return res.status(400).json({
			message: "Validation error",
			details: error.details.map((detail) => detail.message),
		});
	}
	next();
};

const validateUserData = validateData(userSchema);
const validateFeatureRequestCreateData = validateData(
	featureRequestCreateSchema
);

export { validateUserData, validateFeatureRequestCreateData };
