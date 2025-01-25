import { userCreateSchema, userLoginSchema } from "../schema/userSchema.mjs";
import { featureRequestCreateSchema } from "../schema/featureRequestSchema.mjs";

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

const validateUserCreateData = validateData(userCreateSchema);
const validateUserLoginData = validateData(userLoginSchema);
const validateFeatureRequestCreateData = validateData(
	featureRequestCreateSchema
);

export {
	validateUserCreateData,
	validateFeatureRequestCreateData,
	validateUserLoginData,
};
