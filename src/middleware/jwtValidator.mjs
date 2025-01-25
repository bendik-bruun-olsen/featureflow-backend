import jwt from "jsonwebtoken";

const jwtValidator = (req, res, next) => {
	console.log("Validating incomming request");

	const token = req.headers.authorization?.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token provided." });
	}

	try {
		const secretKey = process.env.JWT_SECRET;
		const decoded = jwt.verify(token, secretKey);
		req.userId = decoded.userId;
		next();
	} catch (err) {
		console.error(err);
		res.status(401).json({ message: "Invalid token" });
	}
};

export default jwtValidator;
