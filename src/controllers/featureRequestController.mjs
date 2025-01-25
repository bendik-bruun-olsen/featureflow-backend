import express from "express";
import {
	getAllRequests,
	getRequestById,
	createRequest,
} from "../repositories/featureRequestRepo.mjs";
import { validateFeatureRequestCreateData } from "../middleware/validateData.mjs";
import jwtValidator from "../middleware/jwtValidator.mjs";

const router = express.Router();

router.get("/", jwtValidator, async (req, res) => {
	try {
		const result = await getAllRequests();
		res.status(200).json(result);
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.send({ message: "Error retrieving data", error: err.message });
	}
});

router.get("/:id", jwtValidator, async (req, res) => {
	try {
		const { id } = req.params;
		const result = await getRequestById(id);
		res.status(200).json(result);
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.send({ message: "Error retrieving data", error: err.message });
	}
});

router.post(
	"/create",
	jwtValidator,
	validateFeatureRequestCreateData,
	async (req, res) => {
		const newRequest = req.body;
		try {
			const result = await createRequest({
				...newRequest,
				createdBy: req.userId,
			});
			res.status(201).json(result);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send({ message: "Error creating featureRequest", error: err.message });
		}
	}
);

export default router;
