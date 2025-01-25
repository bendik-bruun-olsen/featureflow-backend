import express from "express";
import { validateFeatureVoteData } from "../middleware/validateData.mjs";
import jwtValidator from "../middleware/jwtValidator.mjs";
import { getRequestById } from "../repositories/featureRequestRepo.mjs";
import {
	deleteVote,
	getVote,
	updateVote,
} from "../repositories/featureVoteRepo.mjs";

const router = express.Router();

router.post("/", jwtValidator, validateFeatureVoteData, async (req, res) => {
	const { featureId, vote } = req.body;
	const { userId } = req;

	try {
		const featureExists = await getRequestById(featureId);
		if (!featureExists) {
			return res.status(404).json({ error: "Feature request not found" });
		}

		const existingVote = await getVote(featureId, userId);
		if (existingVote) {
			const existingVoteId = existingVote.id;
			const existingVoteValue = existingVote.vote;

			if (existingVoteValue === vote) {
				const voteDeleted = await deleteVote(existingVoteId);
				if (!voteDeleted) {
					throw new Error("Failed to remove the vote");
				}
				return res.status(200).json({ message: "Vote removed" });
			} else {
				const voteUpdated = await updateVote(existingVoteId, vote);
				if (!voteUpdated) {
					throw new Error("Failed to update the vote");
				}
				return res.status(200).json({ message: "Vote updated" });
			}
		} else {
			const voteAdded = await addVote(featureId, userId, vote);
			if (!voteAdded) {
				throw new Error("Failed to add the vote");
			}
			return res.status(201).json({ message: "Vote added" });
		}
	} catch (err) {
		console.error(err);
		return res.status(500).send({ error: err.message });
	}
});

router.all("/", (req, res) => {
	res
		.status(405)
		.send({ message: `${req.method} not allowed on /feature-vote` });
});

export default router;
