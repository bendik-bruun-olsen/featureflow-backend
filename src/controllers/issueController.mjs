import express from "express";
import { validateIssueCreateData } from "../middleware/validateData.mjs";
import jwtValidator from "../middleware/jwtValidator.mjs";
import {
	createIssue,
	getAllIssues,
	getIssueById,
} from "../repositories/issueRepo.mjs";

const router = express.Router();

router.get("/", jwtValidator, async (req, res) => {
	try {
		const result = await getAllIssues();
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
		const result = await getIssueById(id);
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
	validateIssueCreateData,
	async (req, res) => {
		console.log("userId: ", req.userId);
		console.log("req.body: ", req.body);

		const newIssue = req.body;

		try {
			const result = await createIssue({
				...newIssue,
				createdBy: req.userId,
			});
			res.status(201).json(result);
		} catch (err) {
			console.log("This one");

			console.error(err);
			res
				.status(500)
				.send({ message: "Error creating Issue", error: err.message });
		}
	}
);

router.all("/", (req, res) => {
	res.status(405).send({ message: `${req.method} not allowed on /issues` });
});

export default router;
