import express from "express";
import bcrypt from "bcrypt";
import {
	createUser,
	getAllUsers,
	getUserByEmail,
	getUserById,
	getUserByUserName,
} from "../repositories/userRepo.mjs";
import { validateUserCreateData } from "../middleware/validateData.mjs";

const router = express.Router();

// router.get("/", async (req, res) => {
// 	try {
// 		const result = await getAllUsers();
// 		res.status(200).json(result);
// 	} catch (err) {
// 		console.error(err);
// 		res
// 			.status(500)
// 			.send({ message: "Error retrieving users", error: err.message });
// 	}
// });

// router.get("/:userId", async (req, res) => {
// 	try {
// 		const { userId } = req.params;
// 		const result = await getUserById(userId);
// 		res.status(200).json(result);
// 	} catch (err) {
// 		console.error(err);
// 		res
// 			.status(500)
// 			.send({ message: "Error retrieving users", error: err.message });
// 	}
// });

router.post("/create", validateUserCreateData, async (req, res) => {
	const newUser = req.body;

	try {
		const existingEmail = await getUserByEmail(newUser.email);
		if (existingEmail) {
			return res.status(400).send({ message: "Email is already in use." });
		}
		const existingUsername = await getUserByUserName(newUser.username);
		if (existingUsername) {
			return res.status(400).send({ message: "Username is already taken." });
		}

		const hashedPassword = await bcrypt.hash(newUser.password, 10);

		const id = await createUser({ ...newUser, password: hashedPassword });
		res
			.status(201)
			.json({ message: "User signed up successfully with ID: ", id });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.send({ message: "Error signing up user.", error: err.message });
	}
});

// router.post("/login", validateUserCreateData);

router.all("/", (req, res) => {
	res.status(405).send({ message: `${req.method} not allowed on /users` });
});

export default router;
