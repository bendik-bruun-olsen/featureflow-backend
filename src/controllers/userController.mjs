import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
	createUser,
	getAllUsers,
	getUserByEmail,
	getUserById,
	getUserByUserName,
} from "../repositories/userRepo.mjs";
import {
	validateUserCreateData,
	validateUserLoginData,
} from "../middleware/validateData.mjs";

import { config } from "dotenv";
config();

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
	console.log("Creating user");

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

router.post("/login", validateUserLoginData, async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return res.status(401).send({ message: "Invalid login credentials." });
		}

		const correctPassword = await bcrypt.compare(password, user.password);
		if (!correctPassword) {
			return res.status(401).send({ message: "Invalid login credentials." });
		}

		const payLoad = { userId: user.id, user: email };
		const secretKey = process.env.JWT_SECRET;
		const token = jwt.sign(payLoad, secretKey, { expiresIn: "1h" });

		res.status(200).json({ message: "Authentication successful.", token });
	} catch (err) {
		console.error(err);
		res
			.status(500)
			.send({ message: "Error logging user in.", error: err.message });
	}
});

router.all("/", (req, res) => {
	res.status(405).send({ message: `${req.method} not allowed on /users` });
});

export default router;
