import express from "express";
import cors from "cors";
import userRoutes from "./src/controllers/userController.mjs";
import featureRequestRoutes from "./src/controllers/featureRequestController.mjs";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/feature-request", featureRequestRoutes);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});

app.get("/", (req, res) => {
	res.send("API is working!");
});

app.all("*", (req, res) => {
	res.status(404);
});
